import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Flag,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Search,
  Clock,
  AlertTriangle,
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
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── API ─────────────────────────────────────────────────────────
const fetchReports = async (params: Record<string, any>) => {
  const { data } = await api.get("/reports", { params });
  return data;
};

const updateReportApi = (id: string, status: string, resolutionNote?: string) =>
  api.patch(`/reports/${id}/review`, { status, resolutionNote });

// ─── Config ───────────────────────────────────────────────────────
const REPORT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  spam:          { label: "Spam",           color: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
  fake_job:      { label: "Fake Job",       color: "bg-red-500/15 text-red-600 border-red-500/30" },
  inappropriate: { label: "Inappropriate",  color: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  scam:          { label: "Scam",           color: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
  other:         { label: "Other",          color: "bg-muted text-muted-foreground border-border" },
};

const REPORT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "bg-amber-500/15 text-amber-600 border-amber-500/30", icon: Clock },
  reviewed:  { label: "Reviewed",  color: "bg-blue-500/15 text-blue-600 border-blue-500/30",   icon: Clock },
  resolved:  { label: "Resolved",  color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 },
  dismissed: { label: "Dismissed", color: "bg-slate-500/15 text-slate-500 border-slate-500/30", icon: XCircle },
};

const ReportTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const cfg = REPORT_TYPE_CONFIG[type] ?? { label: type, color: "bg-muted text-muted-foreground border-border" };
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold px-2.5 py-0.5", cfg.color)}>
      {cfg.label}
    </Badge>
  );
};

const ReportStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = REPORT_STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: Clock };
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn("shadow-none text-xs font-semibold gap-1.5 px-2.5 py-0.5", cfg.color)}>
      <Icon className="size-3.5" /> {cfg.label}
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
  const meta = data?.meta ?? { totalItems: 0, totalPages: 1, page: 1 };

  // Fetch stats for cards
  const { data: statsData } = useQuery({
    queryKey: ["admin", "reports", "stats"],
    queryFn: async () => {
      const [all, pending, resolved] = await Promise.all([
        fetchReports({ limit: 1 }),
        fetchReports({ limit: 1, status: "pending" }),
        fetchReports({ limit: 1, status: "resolved" }),
      ]);
      return {
        total: all.meta?.totalItems || 0,
        pending: pending.meta?.totalItems || 0,
        resolved: resolved.meta?.totalItems || 0,
      };
    },
    refetchInterval: 30000,
  });

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
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý Báo cáo vi phạm"
        subtitle="Xử lý các báo cáo vi phạm tiêu chuẩn cộng đồng từ người dùng (Spam, Lừa đảo...)."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Số Báo Cáo</p>
              <h3 className="text-3xl font-bold text-foreground">{statsData?.total ?? "..."}</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
              <Flag className="size-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chưa Xử Lý (Pending)</p>
              <h3 className="text-3xl font-bold text-foreground">{statsData?.pending ?? "..."}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <AlertTriangle className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Đã Giải Quyết</p>
              <h3 className="text-3xl font-bold text-foreground">{statsData?.resolved ?? "..."}</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle2 className="size-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:px-6 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between bg-muted/10">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="reports-search"
              placeholder="Tìm báo cáo (Tính năng đang bảo trì)..."
              className="pl-9 h-11 bg-background border-input/50 rounded-xl"
              disabled
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger id="reports-status-filter" className="w-full sm:w-48 h-11 bg-background rounded-xl">
              <SelectValue placeholder="Lọc theo Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chưa xử lý (Pending)</SelectItem>
              <SelectItem value="reviewed">Đang xem xét (Reviewed)</SelectItem>
              <SelectItem value="resolved">Đã giải quyết (Resolved)</SelectItem>
              <SelectItem value="dismissed">Bác bỏ (Dismissed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="font-semibold pl-6">Loại vi phạm</TableHead>
                  <TableHead className="font-semibold">Nội dung báo cáo</TableHead>
                  <TableHead className="font-semibold">Ngày tạo</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="size-16 text-emerald-500/30" />
                        <p className="text-base font-medium">Hệ thống sạch sẽ, không có báo cáo vi phạm nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell className="pl-6">
                        <ReportTypeBadge type={report.type} />
                      </TableCell>
                      <TableCell>
                        <div className="py-2">
                          <p className="text-sm font-semibold text-foreground max-w-[350px] line-clamp-2">
                            {report.reason ?? "Không có mô tả chi tiết."}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            Mục tiêu: {report.refType} <span className="opacity-50">#{report.refId?.slice(0, 10)}</span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit"
                        })}
                      </TableCell>
                      <TableCell>
                        <ReportStatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {report.status === "pending" || report.status === "reviewed" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border/50">
                              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">Xử lý báo cáo</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setConfirmAction({ id: report.id, newStatus: "resolved" })}
                                className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10 font-semibold cursor-pointer"
                              >
                                <CheckCircle2 className="mr-2 size-4" /> Đã giải quyết (Resolved)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border/50" />
                              <DropdownMenuItem
                                onClick={() => setConfirmAction({ id: report.id, newStatus: "dismissed" })}
                                className="text-slate-600 focus:text-slate-600 focus:bg-slate-500/10 font-semibold cursor-pointer"
                              >
                                <XCircle className="mr-2 size-4" /> Bác bỏ (Dismissed)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground/50 pr-2 uppercase">Đã chốt</span>
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
          <div className="p-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Trang {meta.page} trên {meta.totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trang trước</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Trang sau</Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <ConfirmationModal
        isOpen={!!confirmAction}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && actionMutation.mutate({ id: confirmAction.id, newStatus: confirmAction.newStatus })}
        isLoading={actionMutation.isPending}
        title={confirmAction?.newStatus === "resolved" ? "Đánh dấu đã giải quyết?" : "Bác bỏ báo cáo?"}
        description={
          confirmAction?.newStatus === "resolved"
            ? "Báo cáo này sẽ được chuyển sang trạng thái Resolved. Tức là hành vi vi phạm đã được xử lý xong."
            : "Báo cáo này sẽ bị bác bỏ (Dismissed). Tức là không tìm thấy vi phạm hoặc báo cáo sai sự thật."
        }
        confirmLabel={confirmAction?.newStatus === "resolved" ? "Đã giải quyết" : "Bác bỏ"}
        isDestructive={confirmAction?.newStatus === "dismissed"}
      />
    </div>
  );
};

export default AdminReportsPage;
