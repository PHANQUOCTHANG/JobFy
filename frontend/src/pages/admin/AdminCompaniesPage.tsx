import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── API ─────────────────────────────────────────────────────────
const fetchCompanies = async (params: Record<string, any>) => {
  const { data } = await axios.get("/api/v1/companies", {
    params,
    withCredentials: true,
  });
  return data;
};

const verifyCompanyApi = (id: string, verified: boolean) =>
  axios.patch(`/api/v1/companies/${id}/verify`, { verified }, { withCredentials: true });

const deleteCompanyApi = (id: string) =>
  axios.delete(`/api/v1/companies/${id}`, { withCredentials: true });

// ─── Main ─────────────────────────────────────────────────────────
const AdminCompaniesPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmVerify, setConfirmVerify] = useState<{ id: string; name: string; verified: boolean; businessLicenseUrl?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const params = {
    page,
    limit: 15,
    ...(search && { keyword: search }),
    ...(verifiedFilter !== "all" && { isVerified: verifiedFilter === "verified" }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "companies", params],
    queryFn: () => fetchCompanies(params),
  });

  const companies: any[] = data?.data ?? [];
  const meta = data?.meta ?? { totalItems: 0, totalPages: 1, page: 1 };

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      verifyCompanyApi(id, verified),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success(vars.verified ? "Đã xác thực công ty" : "Đã hủy xác thực công ty");
      setConfirmVerify(null);
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Company Management"
        subtitle={`Quản lý ${meta.totalItems} công ty trên hệ thống.`}
      />

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="companies-search"
            placeholder="Tìm theo tên công ty..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(1); }}>
          <SelectTrigger id="companies-verified-filter" className="w-full sm:w-48 bg-background">
            <SelectValue placeholder="Trạng thái xác thực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="verified">Đã xác thực</SelectItem>
            <SelectItem value="unverified">Chưa xác thực</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={10} cols={5} hasAvatar />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[300px]">Công ty</TableHead>
                <TableHead>Ngành nghề</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Xác thực</TableHead>
                <TableHead>Tin tuyển dụng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    Không có công ty nào.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 rounded-xl border">
                          <AvatarImage src={company.logoUrl} alt={company.name} className="object-contain p-1" />
                          <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-xs font-bold">
                            {company.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-foreground truncate max-w-[200px]">{company.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{company.website ?? "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{company.industry?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{company.size ?? "—"}</TableCell>
                    <TableCell>
                      {company.isVerified ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25 gap-1 shadow-none">
                          <CheckCircle2 className="size-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1">
                          <XCircle className="size-3" /> Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">{company.totalJobs ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <a href={`/companies/${company.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="size-4" /> Xem trang
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setConfirmVerify({ id: company.id, name: company.name, verified: !company.isVerified, businessLicenseUrl: company.businessLicenseUrl })}
                            className={cn(
                              company.isVerified
                                ? "text-amber-600 focus:text-amber-600 focus:bg-amber-500/10"
                                : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10"
                            )}
                          >
                            {company.isVerified ? (
                              <><ShieldOff className="mr-2 size-4" /> Hủy xác thực</>
                            ) : (
                              <><ShieldCheck className="mr-2 size-4" /> Xác thực</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setConfirmDelete({ id: company.id, name: company.name })}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
        <div className="bg-card border rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <p className="text-sm text-muted-foreground">Trang {meta.page} / {meta.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</Button>
            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Sau</Button>
          </div>
        </div>
      )}

      {/* Verify confirm */}
      <ConfirmationModal
        isOpen={!!confirmVerify}
        onCancel={() => setConfirmVerify(null)}
        onConfirm={() => confirmVerify && verifyMutation.mutate({ id: confirmVerify.id, verified: confirmVerify.verified })}
        isLoading={verifyMutation.isPending}
        title={confirmVerify?.verified ? "Xác thực công ty?" : "Hủy xác thực công ty?"}
        description={
          <div className="flex flex-col gap-4">
            <p>
              {confirmVerify?.verified
                ? `Công ty "${confirmVerify?.name}" sẽ được gắn nhãn "Verified" trên toàn nền tảng.`
                : `Hủy xác thực cho "${confirmVerify?.name}". Nhãn Verified sẽ bị gỡ ngay lập tức.`}
            </p>
            {confirmVerify?.verified && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border bg-muted/30">
                <div className="bg-muted p-2 text-xs font-semibold text-center border-b">
                  Giấy phép kinh doanh
                </div>
                {confirmVerify.businessLicenseUrl ? (
                  <div className="aspect-video relative flex items-center justify-center bg-black/5">
                    <img 
                      src={confirmVerify.businessLicenseUrl} 
                      alt="Business License" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                    <ShieldOff className="size-8 opacity-50" />
                    <p>Công ty này chưa tải lên Giấy phép kinh doanh.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        }
        confirmLabel={confirmVerify?.verified ? "Xác thực" : "Hủy xác thực"}
        isDestructive={!confirmVerify?.verified}
      />

      {/* Delete confirm */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa công ty?"
        description={`Thao tác này sẽ xóa mềm công ty "${confirmDelete?.name}" và toàn bộ dữ liệu liên quan.`}
        confirmLabel="Xóa"
        isDestructive
      />
    </div>
  );
};

export default AdminCompaniesPage;
