import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  FileText,
  Search,
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  UserCheck,
  Briefcase,
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
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminCandidateFormModal from "./components/AdminCandidateFormModal";
import { Link } from "react-router-dom";

// ─── API ─────────────────────────────────────────────────────────
const fetchCandidates = async (params: Record<string, any>) => {
  const { data } = await api.get("/candidate-profiles/admin", { params });
  return data;
};

const updateCandidateApi = async ({ id, data }: { id: string; data: any }) => {
  const res = await api.patch(`/candidate-profiles/${id}/admin`, data);
  return res.data;
};

const deleteCandidateApi = (id: string) =>
  api.delete(`/candidate-profiles/${id}/admin`);

// ─── Main ─────────────────────────────────────────────────────────
const AdminCandidatesPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; fullName: string } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Lấy stats
  const { data: stats } = useQuery({
    queryKey: ["admin", "candidates", "stats"],
    queryFn: async () => {
      const allRes = await api.get("/candidate-profiles/admin?limit=1");
      return {
        all: allRes.data.meta?.total || 0,
      };
    },
    refetchInterval: 60000,
  });

  const params = {
    page,
    limit: 15,
    ...(search && { search: search }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "candidates", params],
    queryFn: () => fetchCandidates(params),
  });

  const candidates: any[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPages: 1, page: 1 };

  const updateMutation = useMutation({
    mutationFn: updateCandidateApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "candidates"] });
      toast.success("Cập nhật hồ sơ ứng viên thành công");
      setIsEditModalOpen(false);
      setSelectedCandidate(null);
    },
    onError: () => toast.error("Cập nhật thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCandidateApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "candidates"] });
      toast.success("Đã xóa hồ sơ ứng viên");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại."),
  });

  const handleOpenEdit = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const handleSave = (id: string, data: any) => {
    updateMutation.mutate({ id, data });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý Ứng viên"
        subtitle="Theo dõi, duyệt và quản lý hồ sơ của các ứng viên trên hệ thống."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Hồ Sơ</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.all ?? "..."}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
              <FileText className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:px-6 border-b border-border/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên ứng viên hoặc chức danh..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-11 bg-background border-input/50 rounded-xl focus-visible:ring-primary/20"
            />
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
                  <TableHead className="w-[300px] font-semibold">Ứng viên</TableHead>
                  <TableHead className="font-semibold">Kinh nghiệm</TableHead>
                  <TableHead className="font-semibold">Lượt xem</TableHead>
                  <TableHead className="font-semibold">Trạng thái CV</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <UserCheck className="size-12 text-muted-foreground/30" />
                        <p className="text-base font-medium">Không có hồ sơ nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((cand) => (
                    <TableRow key={cand.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border shadow-sm rounded-full">
                            <AvatarImage src={cand.user?.avatarUrl || ""} className="object-cover" />
                            <AvatarFallback className="font-bold bg-primary/10 text-primary">
                              {cand.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
                              {cand.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {cand.headline || cand.desiredJobTitle || "Chưa cập nhật chức danh"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium capitalize">
                            {cand.experienceLevel ? cand.experienceLevel.replace("_", " ").toLowerCase() : "Chưa cập nhật"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs shadow-none border-border/50 bg-background inline-flex items-center gap-1.5">
                          <Eye className="size-3 text-muted-foreground" />
                          {cand.profileViews ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cand.isLooking ? (
                          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                            Đang tìm việc
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-500/15 text-slate-500 border-slate-500/30">
                            Chưa sẵn sàng
                          </Badge>
                        )}
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
                            
                            <DropdownMenuItem asChild className="font-medium cursor-pointer">
                              <Link to={`/candidates/${cand.id}`} target="_blank">
                                <Eye className="mr-2 size-4" /> Xem CV Public
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleOpenEdit(cand)} className="font-medium cursor-pointer">
                              <Pencil className="mr-2 size-4 text-blue-600" /> Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-border/50" />
                            
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: cand.id, fullName: cand.fullName })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa hồ sơ
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

      <AdminCandidateFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />

      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa hồ sơ ứng viên?"
        description={`Hồ sơ của ứng viên "${confirmDelete?.fullName}" sẽ bị xóa. Ứng viên này vẫn còn tài khoản User (để xóa hoàn toàn tài khoản, vui lòng vào trang Quản lý Users). Không thể hoàn tác!`}
        confirmLabel="Xóa"
        isDestructive
      />
    </div>
  );
};

export default AdminCandidatesPage;
