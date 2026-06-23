import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Building2,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Search,
  ExternalLink,
  Edit,
  Building,
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
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminCompanyFormModal from "./components/AdminCompanyFormModal";

// ─── API ─────────────────────────────────────────────────────────
const fetchCompanies = async (params: Record<string, any>) => {
  const { data } = await api.get("/companies", {
    params,
  });
  return data;
};

const verifyCompanyApi = (id: string, verified: boolean, reason?: string) =>
  api.patch(`/admin/employer/${id}/verify`, { status: verified ? "approved" : "rejected", reason: reason || "" });

const deleteCompanyApi = (id: string) =>
  api.delete(`/companies/${id}`);

const updateCompanyApi = async ({ id, data }: { id: string; data: any }) => {
  const res = await api.patch(`/companies/${id}`, data);
  return res.data;
};

// ─── Main ─────────────────────────────────────────────────────────
const AdminCompaniesPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmVerify, setConfirmVerify] = useState<{ id: string; name: string; verified: boolean; businessLicenseUrl?: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  // Thêm state cho Edit Modal
  const [editingCompany, setEditingCompany] = useState<any | null>(null);

  // Fetch Stats (lấy tổng số bằng cách limit=1 và isVerified=true/false)
  const { data: stats } = useQuery({
    queryKey: ["admin", "companies", "stats"],
    queryFn: async () => {
      const [allRes, verifiedRes, unverifiedRes] = await Promise.all([
        api.get("/companies?limit=1", { withCredentials: true }),
        api.get("/companies?isVerified=true&limit=1", { withCredentials: true }),
        api.get("/companies?isVerified=false&limit=1", { withCredentials: true }),
      ]);
      return {
        all: allRes.data.meta?.total || 0,
        verified: verifiedRes.data.meta?.total || 0,
        unverified: unverifiedRes.data.meta?.total || 0,
      };
    },
    refetchInterval: 60000,
  });

  const params = {
    page,
    limit: 15,
    ...(search && { search: search }),
    ...(verifiedFilter !== "all" && { isVerified: verifiedFilter === "verified" }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "companies", params],
    queryFn: () => fetchCompanies(params),
  });

  const companies: any[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPages: 1, page: 1 };

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified, reason }: { id: string; verified: boolean; reason?: string }) =>
      verifyCompanyApi(id, verified, reason),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success(vars.verified ? "Đã xác thực công ty" : "Đã hủy xác thực công ty");
      setConfirmVerify(null);
      setRejectReason("");
    },
    onError: () => toast.error("Thao tác thất bại. Vui lòng thử lại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompanyApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("Đã xóa công ty");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại. Vui lòng thử lại."),
  });

  const updateMutation = useMutation({
    mutationFn: updateCompanyApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("Cập nhật thông tin công ty thành công!");
      setEditingCompany(null);
    },
    onError: () => toast.error("Cập nhật thất bại. Vui lòng kiểm tra lại."),
  });

  const handleEditSubmit = (id: string, data: any) => {
    updateMutation.mutate({ id, data });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý Công ty"
        subtitle="Quản lý danh sách, xác thực và thông tin của các doanh nghiệp."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Số Công Ty</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.all ?? "..."}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
              <Building className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Đã Xác Thực</p>
              <h3 className="text-3xl font-bold text-emerald-600">{stats?.verified ?? "..."}</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <ShieldCheck className="size-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chưa Xác Thực</p>
              <h3 className="text-3xl font-bold text-amber-600">{stats?.unverified ?? "..."}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <ShieldOff className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters & Tabs */}
        <div className="p-4 sm:px-6 border-b border-border/50 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs
              value={verifiedFilter}
              onValueChange={(val) => { setVerifiedFilter(val); setPage(1); }}
              className="w-full sm:w-auto overflow-x-auto"
            >
              <TabsList className="bg-secondary/50 p-1 h-11 w-full sm:w-auto inline-flex justify-start">
                <TabsTrigger value="all" className="px-6 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">Tất cả</TabsTrigger>
                <TabsTrigger value="verified" className="px-6 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center gap-2">
                  <ShieldCheck className="size-3.5" /> Đã xác thực
                </TabsTrigger>
                <TabsTrigger value="unverified" className="px-6 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center gap-2">
                  <ShieldOff className="size-3.5" /> Chưa xác thực
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:max-w-sm shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên công ty, mã số thuế..."
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
            <TableSkeleton rows={10} cols={5} hasAvatar />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="w-[300px] font-semibold">Công ty</TableHead>
                  <TableHead className="font-semibold">Ngành nghề</TableHead>
                  <TableHead className="font-semibold">Quy mô</TableHead>
                  <TableHead className="font-semibold">Xác thực</TableHead>
                  <TableHead className="text-center font-semibold">Tin tuyển dụng</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="size-12 text-muted-foreground/30" />
                        <p className="text-base font-medium">Không tìm thấy công ty nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="size-10 rounded-xl border shadow-sm bg-white">
                            <AvatarImage src={company.logoUrl} alt={company.name} className="object-contain p-1" />
                            <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-sm font-extrabold">
                              {company.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col pr-4">
                            <p className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setEditingCompany(company)}>
                              {company.name}
                            </p>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[12px] text-muted-foreground hover:text-primary hover:underline truncate max-w-[200px]"
                            >
                              {company.website ?? "Chưa có website"}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-muted-foreground">{company.industry?.name ?? "—"}</TableCell>
                      <TableCell className="text-sm font-medium text-muted-foreground">{company.size?.replace("value_", "").replace("_", " - ") ?? "—"}</TableCell>
                      <TableCell>
                        {company.isVerified ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25 gap-1.5 px-2.5 py-1 shadow-none text-xs">
                            <ShieldCheck className="size-3.5" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-border/50 gap-1.5 px-2.5 py-1 shadow-none text-xs bg-background">
                            <ShieldOff className="size-3.5" /> Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs shadow-none border-border/50 bg-background inline-flex items-center gap-1.5 px-3">
                          {company.totalJobs ?? 0}
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

                            <DropdownMenuItem asChild>
                              <a href={`/companies/${company.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 cursor-pointer font-medium">
                                <ExternalLink className="size-4 text-primary" /> Xem trang Public
                              </a>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setEditingCompany(company)} className="cursor-pointer font-medium">
                              <Edit className="mr-2 size-4 text-blue-600" /> Sửa thông tin
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-border/50" />

                            <DropdownMenuItem
                              onClick={() => setConfirmVerify({ id: company.id, name: company.name, verified: !company.isVerified, businessLicenseUrl: company.businessLicenseUrl })}
                              className={cn(
                                "cursor-pointer font-bold",
                                company.isVerified
                                  ? "text-amber-600 focus:text-amber-600 focus:bg-amber-500/10"
                                  : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10"
                              )}
                            >
                              {company.isVerified ? (
                                <><ShieldOff className="mr-2 size-4" /> Hủy xác thực</>
                              ) : (
                                <><ShieldCheck className="mr-2 size-4" /> Xác thực công ty</>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: company.id, name: company.name })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-bold"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa công ty
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

      {/* Edit Company Modal */}
      <AdminCompanyFormModal
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        company={editingCompany}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
      />

      {/* Verify confirm */}
      <ConfirmationModal
        isOpen={!!confirmVerify}
        onCancel={() => { setConfirmVerify(null); setRejectReason(""); }}
        onConfirm={() => confirmVerify && verifyMutation.mutate({ id: confirmVerify.id, verified: confirmVerify.verified, reason: rejectReason })}
        isLoading={verifyMutation.isPending}
        title={confirmVerify?.verified ? "Xác nhận cấp Verified?" : "Hủy xác thực công ty?"}
        description={
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {confirmVerify?.verified
                ? `Công ty "${confirmVerify?.name}" sẽ được gắn nhãn "Verified" trên toàn bộ nền tảng, tăng độ uy tín với ứng viên.`
                : `Hủy xác thực cho "${confirmVerify?.name}". Nhãn Verified sẽ bị gỡ bỏ ngay lập tức.`}
            </p>
            {confirmVerify?.verified ? (
              <div className="mt-2 rounded-2xl overflow-hidden border border-border/50 shadow-inner">
                <div className="bg-muted/50 p-3 text-xs font-bold text-center border-b border-border/50 uppercase tracking-wider">
                  Giấy phép kinh doanh đính kèm
                </div>
                {confirmVerify.businessLicenseUrl ? (
                  <div className="relative flex items-center justify-center bg-black/5 p-4 min-h-[200px]">
                    <img
                      src={confirmVerify.businessLicenseUrl}
                      alt="Business License"
                      className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="p-10 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
                    <div className="bg-muted/50 p-4 rounded-full">
                      <ShieldOff className="size-8 text-muted-foreground/50" />
                    </div>
                    <p className="font-medium">Công ty này chưa tải lên Giấy phép kinh doanh.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2">
                <label className="text-xs font-semibold mb-2 block">Lý do từ chối (bắt buộc):</label>
                <Input 
                  placeholder="Ví dụ: Giấy phép kinh doanh mờ, sai thông tin..." 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-background"
                />
              </div>
            )}
          </div>
        }
        confirmLabel={confirmVerify?.verified ? "Cấp Verified" : "Hủy xác thực"}
        isDestructive={!confirmVerify?.verified}
      />

      {/* Delete confirm */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa công ty?"
        description={`Cảnh báo: Sẽ xóa toàn bộ dữ liệu của công ty "${confirmDelete?.name}" bao gồm tất cả các tin tuyển dụng liên quan. Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa vĩnh viễn"
        isDestructive
      />
    </div>
  );
};

export default AdminCompaniesPage;
