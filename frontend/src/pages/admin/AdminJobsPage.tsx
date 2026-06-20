import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Briefcase,
  MoreHorizontal,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  PauseCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminJobDetailsModal from "./components/AdminJobDetailsModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// ─── API ─────────────────────────────────────────────────────────
const fetchJobs = async (params: Record<string, any>) => {
  const { data } = await axios.get("/api/v1/jobs", { params, withCredentials: true });
  return data;
};

const updateJobStatusApi = (id: string, status: string, rejectedReason?: string) =>
  axios.patch(`/api/v1/jobs/${id}/status`, { status, rejectedReason }, { withCredentials: true });

const deleteJobApi = (id: string) =>
  axios.delete(`/api/v1/jobs/${id}/force`, { withCredentials: true });

// ─── Status Badge ──────────────────────────────────────────────
const JOB_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:   { label: "Chờ duyệt", className: "bg-amber-500/15 text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse" },
  published: { label: "Published", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25" },
  rejected:  { label: "Rejected",  className: "bg-red-500/15 text-red-600 border-red-500/20" },
  draft:     { label: "Draft",     className: "bg-muted text-muted-foreground border-border" },
  closed:    { label: "Closed",    className: "bg-slate-500/15 text-slate-500 border-slate-500/20" },
  expired:   { label: "Expired",   className: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
  paused:    { label: "Paused",    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = JOB_STATUS_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold", cfg.className)}>
      {cfg.label}
    </Badge>
  );
};

// ─── Main ─────────────────────────────────────────────────────────
const AdminJobsPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Mặc định hiển thị chờ duyệt
  const [page, setPage] = useState(1);
  const [confirmStatus, setConfirmStatus] = useState<{ id: string; title: string; status: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  // Thêm state cho JobDetails
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [jobToReject, setJobToReject] = useState<{ id: string; title: string } | null>(null);

  const params = {
    page,
    limit: 15,
    ...(search && { keyword: search }),
    ...(statusFilter !== "all" && { status: statusFilter }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "jobs", params],
    queryFn: () => fetchJobs(params),
  });

  const jobs: any[] = data?.data ?? [];
  const meta = data?.meta ?? { totalItems: 0, totalPages: 1, page: 1 };

  const statusMutation = useMutation({
    mutationFn: ({ id, status, rejectedReason }: { id: string; status: string; rejectedReason?: string }) => 
      updateJobStatusApi(id, status, rejectedReason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast.success("Cập nhật trạng thái thành công");
      setConfirmStatus(null);
      setIsRejectModalOpen(false);
      setJobToReject(null);
      setRejectReason("");
      setSelectedJobId(null); // Đóng modal chi tiết nếu đang mở
    },
    onError: () => toast.error("Thao tác thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJobApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast.success("Đã xóa tin tuyển dụng");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại."),
  });

  const statusActions = [
    { status: "published", label: "Publish", icon: CheckCircle, color: "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10" },
    { status: "paused",    label: "Pause",   icon: PauseCircle, color: "text-amber-600 focus:text-amber-600 focus:bg-amber-500/10" },
    { status: "closed",    label: "Close",   icon: XCircle,     color: "text-slate-500 focus:bg-slate-500/10" },
  ];

  // Load job details for modal
  const { data: jobDetailsData, isFetching: isFetchingDetails } = useQuery({
    queryKey: ["admin", "jobs", selectedJobId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/jobs/${selectedJobId}`, { withCredentials: true });
      return data;
    },
    enabled: !!selectedJobId,
  });

  const selectedJobDetails = jobDetailsData?.data;

  const handleApprove = (id: string) => {
    statusMutation.mutate({ id, status: "published" });
  };

  const handleOpenReject = (id: string, title: string) => {
    setJobToReject({ id, title });
    setIsRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!jobToReject) return;
    statusMutation.mutate({ id: jobToReject.id, status: "rejected", rejectedReason: rejectReason });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Job Moderation"
        subtitle={`Kiểm duyệt ${meta.totalItems} tin tuyển dụng trên hệ thống.`}
      />

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="jobs-search"
            placeholder="Tìm theo tên công việc..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger id="jobs-status-filter" className="w-full sm:w-44 bg-background">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Pending (Chờ duyệt)</SelectItem>
            <SelectItem value="published">Published (Đã duyệt)</SelectItem>
            <SelectItem value="rejected">Rejected (Từ chối)</SelectItem>
            <SelectItem value="draft">Draft (Nháp)</SelectItem>
            <SelectItem value="paused">Paused (Tạm dừng)</SelectItem>
            <SelectItem value="closed">Closed (Đã đóng)</SelectItem>
            <SelectItem value="expired">Expired (Hết hạn)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={12} cols={5} />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[280px]">Tin tuyển dụng</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Lượt xem</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    Không tìm thấy tin tuyển dụng.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0">
                          <Briefcase className="size-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground truncate max-w-[220px]">{job.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.publishedAt
                              ? new Date(job.publishedAt).toLocaleDateString("vi-VN")
                              : "Chưa xuất bản"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.company?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize shadow-none">
                        {job.jobType?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={job.status} /></TableCell>
                    <TableCell className="text-center tabular-nums text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="size-3 text-muted-foreground/60" />
                        {job.viewCount ?? 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedJobId(job.id)}>
                            <Eye className="mr-2 size-4" /> Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {job.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprove(job.id)}
                                className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10 font-medium"
                              >
                                <CheckCircle className="mr-2 size-4" /> Duyệt tin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenReject(job.id, job.title)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-500/10 font-medium"
                              >
                                <XCircle className="mr-2 size-4" /> Từ chối tin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {statusActions
                            .filter((a) => a.status !== job.status)
                            .map((action) => (
                              <DropdownMenuItem
                                key={action.status}
                                onClick={() => setConfirmStatus({ id: job.id, title: job.title, status: action.status })}
                                className={action.color}
                              >
                                <action.icon className="mr-2 size-4" /> {action.label}
                              </DropdownMenuItem>
                            ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setConfirmDelete({ id: job.id, title: job.title })}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 size-4" /> Xóa tin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="bg-card border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <p className="text-sm text-muted-foreground">Trang {meta.page} / {meta.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</Button>
            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Sau</Button>
          </div>
        </div>
      )}

      {/* Status confirm */}
      <ConfirmationModal
        isOpen={!!confirmStatus}
        onCancel={() => setConfirmStatus(null)}
        onConfirm={() => confirmStatus && statusMutation.mutate({ id: confirmStatus.id, status: confirmStatus.status })}
        isLoading={statusMutation.isPending}
        title={`Đổi trạng thái thành "${confirmStatus?.status}"?`}
        description={`Tin "${confirmStatus?.title}" sẽ được cập nhật ngay lập tức.`}
        confirmLabel="Xác nhận"
      />

      {/* Delete confirm */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa tin tuyển dụng?"
        description={`Admin sẽ xóa vĩnh viễn tin "${confirmDelete?.title}". Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        isDestructive
      />

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Từ chối tin tuyển dụng</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối để nhà tuyển dụng biết cần phải sửa đổi những gì.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Lương không hợp lý, mô tả quá ngắn..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Hủy</Button>
            <Button 
              variant="destructive" 
              onClick={submitReject} 
              disabled={!rejectReason.trim() || statusMutation.isPending}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Drawer */}
      <AdminJobDetailsModal
        isOpen={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
        job={selectedJobDetails}
        onApprove={handleApprove}
        onReject={(id) => handleOpenReject(id, selectedJobDetails?.title)}
        isPending={statusMutation.isPending || isFetchingDetails}
      />
    </div>
  );
};

export default AdminJobsPage;
