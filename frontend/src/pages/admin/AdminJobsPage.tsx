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
  FileText,
  Clock,
  ShieldCheck,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  pending:   { label: "Chờ duyệt", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  published: { label: "Đã duyệt", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  rejected:  { label: "Từ chối",  className: "bg-red-500/15 text-red-600 border-red-500/30" },
  draft:     { label: "Nháp",     className: "bg-muted text-muted-foreground border-border" },
  closed:    { label: "Đã đóng",    className: "bg-slate-500/15 text-slate-500 border-slate-500/30" },
  expired:   { label: "Hết hạn",   className: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
  paused:    { label: "Tạm dừng",    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = JOB_STATUS_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold whitespace-nowrap", cfg.className)}>
      {cfg.label}
    </Badge>
  );
};

// ─── Main ─────────────────────────────────────────────────────────
const AdminJobsPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [confirmStatus, setConfirmStatus] = useState<{ id: string; title: string; status: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [jobToReject, setJobToReject] = useState<{ id: string; title: string } | null>(null);

  // Stats Fetching (Tối ưu bằng cách lấy limit=1 để đếm tổng số items)
  const { data: stats } = useQuery({
    queryKey: ["admin", "jobs", "stats"],
    queryFn: async () => {
      const [allRes, pendingRes, publishedRes] = await Promise.all([
        axios.get("/api/v1/jobs?limit=1", { withCredentials: true }),
        axios.get("/api/v1/jobs?status=pending&limit=1", { withCredentials: true }),
        axios.get("/api/v1/jobs?status=published&limit=1", { withCredentials: true }),
      ]);
      return {
        all: allRes.data.meta?.totalItems || 0,
        pending: pendingRes.data.meta?.totalItems || 0,
        published: publishedRes.data.meta?.totalItems || 0,
      };
    },
    refetchInterval: 60000, // Làm mới mỗi phút
  });

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
      setSelectedJobId(null);
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
    { status: "published", label: "Duyệt xuất bản", icon: CheckCircle, color: "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10" },
    { status: "paused",    label: "Tạm dừng",   icon: PauseCircle, color: "text-amber-600 focus:text-amber-600 focus:bg-amber-500/10" },
    { status: "closed",    label: "Đóng tin",   icon: XCircle,     color: "text-slate-500 focus:bg-slate-500/10" },
  ];

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
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý tin tuyển dụng"
        subtitle="Duyệt, từ chối và theo dõi chất lượng tin đăng từ nhà tuyển dụng."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Tin Đăng</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.all ?? "..."}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
              <FileText className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chờ Phê Duyệt</p>
              <h3 className="text-3xl font-bold text-amber-600">{stats?.pending ?? "..."}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <Clock className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Đang Hoạt Động</p>
              <h3 className="text-3xl font-bold text-emerald-600">{stats?.published ?? "..."}</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <ShieldCheck className="size-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters & Tabs */}
        <div className="p-4 sm:px-6 border-b border-border/50 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs 
              value={statusFilter} 
              onValueChange={(val) => { setStatusFilter(val); setPage(1); }}
              className="w-full sm:w-auto overflow-x-auto"
            >
              <TabsList className="bg-secondary/50 p-1 h-11 w-full sm:w-auto inline-flex justify-start">
                <TabsTrigger value="pending" className="px-5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">Chờ duyệt</TabsTrigger>
                <TabsTrigger value="published" className="px-5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">Đã xuất bản</TabsTrigger>
                <TabsTrigger value="rejected" className="px-5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">Từ chối</TabsTrigger>
                <TabsTrigger value="all" className="px-5 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">Tất cả</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:max-w-xs shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên công việc..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-11 bg-background border-input/50 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="w-[350px] font-semibold">Công việc</TableHead>
                  <TableHead className="font-semibold">Công ty</TableHead>
                  <TableHead className="font-semibold">Phân loại</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-center font-semibold">Tương tác</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Briefcase className="size-12 text-muted-foreground/30" />
                        <p className="text-base font-medium">Không tìm thấy kết quả nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col gap-1 pr-4">
                          <p className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedJobId(job.id)}>
                            {job.title}
                          </p>
                          <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("vi-VN") : "Chưa xuất bản"}
                            </span>
                            {job.isRemote && (
                              <>
                                <span>•</span>
                                <span className="text-primary/80">Remote</span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border shadow-sm rounded-md bg-white">
                            <AvatarImage src={job.company?.logoUrl || ""} className="object-contain p-0.5" />
                            <AvatarFallback className="rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                              {job.company?.name?.charAt(0) || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-foreground/90 max-w-[150px] truncate">
                            {job.company?.name ?? "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px] capitalize shadow-none bg-secondary/60 hover:bg-secondary">
                          {job.jobType?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell><StatusBadge status={job.status} /></TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs shadow-none border-border/50 bg-background inline-flex items-center gap-1.5">
                          <Eye className="size-3 text-muted-foreground" />
                          {job.viewCount ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border/50">
                            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">Tùy chọn</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedJobId(job.id)} className="font-medium cursor-pointer">
                              <Eye className="mr-2 size-4 text-primary" /> Xem chi tiết tin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            
                            {job.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(job.id)}
                                  className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10 font-bold cursor-pointer"
                                >
                                  <CheckCircle className="mr-2 size-4" /> Duyệt hiển thị
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenReject(job.id, job.title)}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-500/10 font-bold cursor-pointer"
                                >
                                  <XCircle className="mr-2 size-4" /> Từ chối tin
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/50" />
                              </>
                            )}
                            
                            {statusActions
                              .filter((a) => a.status !== job.status)
                              .map((action) => (
                                <DropdownMenuItem
                                  key={action.status}
                                  onClick={() => setConfirmStatus({ id: job.id, title: job.title, status: action.status })}
                                  className={cn("font-medium cursor-pointer", action.color)}
                                >
                                  <action.icon className="mr-2 size-4" /> {action.label}
                                </DropdownMenuItem>
                              ))}
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: job.id, title: job.title })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa vĩnh viễn
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
          <div className="p-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Trang {meta.page} trên {meta.totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trang trước</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Trang sau</Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={!!confirmStatus}
        onCancel={() => setConfirmStatus(null)}
        onConfirm={() => confirmStatus && statusMutation.mutate({ id: confirmStatus.id, status: confirmStatus.status })}
        isLoading={statusMutation.isPending}
        title={`Chuyển trạng thái thành "${confirmStatus?.status}"?`}
        description={`Tin tuyển dụng "${confirmStatus?.title}" sẽ bị ảnh hưởng ngay lập tức trên hệ thống.`}
        confirmLabel="Xác nhận đổi"
      />

      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa vĩnh viễn tin tuyển dụng?"
        description={`Cảnh báo: Sẽ xóa toàn bộ dữ liệu của tin "${confirmDelete?.title}" khỏi hệ thống, bao gồm cả hồ sơ ứng tuyển liên quan. Không thể hoàn tác!`}
        confirmLabel="Xóa vĩnh viễn"
        isDestructive
      />

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <div className="p-6 bg-muted/30 border-b border-border/50">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <XCircle className="size-5 text-red-500" />
              Từ chối tin tuyển dụng
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm">
              Bạn đang từ chối tin <span className="font-bold text-foreground">"{jobToReject?.title}"</span>. Hãy nêu rõ lý do để nhà tuyển dụng có thể chỉnh sửa lại.
            </DialogDescription>
          </div>
          <div className="p-6">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Mô tả công việc quá sơ sài, thiếu thông tin lương, có dấu hiệu vi phạm chính sách..."
              className="min-h-[120px] rounded-xl resize-none bg-background shadow-sm focus-visible:ring-red-500/20"
            />
          </div>
          <div className="p-4 bg-muted/30 border-t border-border/50 flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl font-medium" onClick={() => setIsRejectModalOpen(false)}>Hủy bỏ</Button>
            <Button 
              variant="destructive" 
              className="rounded-xl font-bold shadow-lg shadow-red-500/20"
              onClick={submitReject} 
              disabled={!rejectReason.trim() || statusMutation.isPending}
            >
              Xác nhận từ chối
            </Button>
          </div>
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
