import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Flag,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Search,
  Clock,
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

// ─── API ─────────────────────────────────────────────────────────
const fetchReports = async (params: Record<string, any>) => {
  const { data } = await axios.get("/api/v1/reports", { params, withCredentials: true });
  return data;
};

const updateReportApi = (id: string, status: string, note?: string) =>
  axios.patch(`/api/v1/reports/${id}/review`, { status, note }, { withCredentials: true });

// ─── Config ───────────────────────────────────────────────────────
const REPORT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  spam:          { label: "Spam",           color: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
  fake_job:      { label: "Fake Job",       color: "bg-red-500/15 text-red-600 border-red-500/20" },
  inappropriate: { label: "Inappropriate",  color: "bg-purple-500/15 text-purple-600 border-purple-500/20" },
  scam:          { label: "Scam",           color: "bg-rose-500/15 text-rose-700 border-rose-500/20" },
  other:         { label: "Other",          color: "bg-muted text-muted-foreground border-border" },
};

const REPORT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "bg-amber-500/15 text-amber-600 border-amber-500/20", icon: Clock },
  reviewed:  { label: "Reviewed",  color: "bg-blue-500/15 text-blue-600 border-blue-500/20",   icon: Clock },
  resolved:  { label: "Resolved",  color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  dismissed: { label: "Dismissed", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const ReportTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const cfg = REPORT_TYPE_CONFIG[type] ?? { label: type, color: "" };
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold", cfg.color)}>
      {cfg.label}
    </Badge>
  );
};

const ReportStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = REPORT_STATUS_CONFIG[status] ?? { label: status, color: "", icon: Clock };
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold gap-1", cfg.color)}>
      <Icon className="size-3" /> {cfg.label}
    </Badge>
  );
};

// ─── Main ─────────────────────────────────────────────────────────
const AdminReportsPage: React.FC = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    newStatus: "resolved" | "dismissed";
    reason?: string;
  } | null>(null);

  const params = {
    page,
    limit: 15,
    ...(statusFilter !== "all" && { status: statusFilter }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => fetchReports(params),
  });

  const reports: any[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPages: 1, page: 1 };

  const actionMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      updateReportApi(id, newStatus),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast.success(vars.newStatus === "resolved" ? "Đã đánh dấu đã giải quyết" : "Đã bác bỏ báo cáo");
      setConfirmAction(null);
    },
    onError: () => toast.error("Thao tác thất bại."),
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Reports Management"
        subtitle={`Quản lý ${meta.total ?? 0} báo cáo vi phạm từ người dùng.`}
      />

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reports-search"
            placeholder="Tìm theo ID báo cáo..."
            className="pl-9 bg-background"
            disabled
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger id="reports-status-filter" className="w-full sm:w-44 bg-background">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
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
                <TableHead>Loại vi phạm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Ngày báo cáo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Flag className="size-10 text-muted-foreground/30" />
                      <p>Không có báo cáo nào.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id} className="group">
                    <TableCell><ReportTypeBadge type={report.type} /></TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground truncate max-w-[300px]">{report.reason ?? "—"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ref: {report.refType} — {report.refId?.slice(0, 8)}...
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                    <TableCell className="text-right">
                      {report.status === "pending" || report.status === "reviewed" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Xử lý báo cáo</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({ id: report.id, newStatus: "resolved" })}
                              className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10"
                            >
                              <CheckCircle2 className="mr-2 size-4" /> Đã giải quyết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({ id: report.id, newStatus: "dismissed" })}
                              className="text-muted-foreground focus:bg-muted"
                            >
                              <XCircle className="mr-2 size-4" /> Bác bỏ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground pr-3">Đã xử lý</span>
                      )}
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

      {/* Confirm modal */}
      <ConfirmationModal
        isOpen={!!confirmAction}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && actionMutation.mutate({ id: confirmAction.id, newStatus: confirmAction.newStatus })}
        isLoading={actionMutation.isPending}
        title={confirmAction?.newStatus === "resolved" ? "Đánh dấu đã giải quyết?" : "Bác bỏ báo cáo?"}
        description={
          confirmAction?.newStatus === "resolved"
            ? "Báo cáo sẽ được chuyển sang trạng thái Resolved. Hành động vi phạm đã được xử lý."
            : "Báo cáo sẽ bị bác bỏ — không tìm thấy vi phạm."
        }
        confirmLabel={confirmAction?.newStatus === "resolved" ? "Đã giải quyết" : "Bác bỏ"}
        isDestructive={confirmAction?.newStatus === "dismissed"}
      />
    </div>
  );
};

export default AdminReportsPage;
