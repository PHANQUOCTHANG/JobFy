import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Pencil,
  ShieldAlert,
  UserCheck,
  Shield,
  Briefcase,
  User,
  Ban
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// ─── API ─────────────────────────────────────────────────────────
const fetchUsers = async (params: Record<string, any>) => {
  const { data } = await api.get("/users", { params });
  return data;
};

const updateUserApi = async ({ id, data }: { id: string; data: any }) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

const deleteUserApi = (id: string) =>
  api.delete(`/users/${id}`);

// ─── Main ─────────────────────────────────────────────────────────
const AdminUsersPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; email: string } | null>(null);

  // Lấy stats
  const { data: stats } = useQuery({
    queryKey: ["admin", "users", "stats"],
    queryFn: async () => {
      const allRes = await api.get("/users?limit=1");
      const adminRes = await api.get("/users?limit=1&role=admin");
      const empRes = await api.get("/users?limit=1&role=employer");
      const candRes = await api.get("/users?limit=1&role=candidate");
      return {
        all: allRes.data.meta?.total || 0,
        admin: adminRes.data.meta?.total || 0,
        employer: empRes.data.meta?.total || 0,
        candidate: candRes.data.meta?.total || 0,
      };
    },
    refetchInterval: 60000,
  });

  const params = {
    page,
    limit: 15,
    ...(search && { search: search }),
    ...(roleFilter && { role: roleFilter }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchUsers(params),
  });

  const users: any[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPages: 1, page: 1 };

  const updateMutation = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: () => toast.error("Cập nhật thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Đã khóa / xóa mềm tài khoản");
      setConfirmDelete(null);
    },
    onError: () => {
      toast.error("Không thể khóa tài khoản lúc này");
    },
  });

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role === roleFilter ? "" : role);
    setPage(1);
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    updateMutation.mutate({ id: user.id, data: { status: newStatus } });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="w-4 h-4 text-rose-500" />;
      case "employer": return <Briefcase className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-rose-200">Admin</Badge>;
      case "employer": return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-200">Employer</Badge>;
      case "candidate": return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Candidate</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Người dùng"
        description="Theo dõi và quản lý tài khoản thành viên hệ thống"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card className={cn("cursor-pointer transition-colors", roleFilter === "" ? "border-primary" : "")} onClick={() => handleRoleFilter("")}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <UserCheck className="w-8 h-8 text-slate-500 mb-2" />
            <h3 className="text-2xl font-bold">{stats?.all || 0}</h3>
            <p className="text-sm text-muted-foreground">Tổng Users</p>
          </CardContent>
        </Card>
        <Card className={cn("cursor-pointer transition-colors", roleFilter === "admin" ? "border-primary" : "")} onClick={() => handleRoleFilter("admin")}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Shield className="w-8 h-8 text-rose-500 mb-2" />
            <h3 className="text-2xl font-bold">{stats?.admin || 0}</h3>
            <p className="text-sm text-muted-foreground">Admin</p>
          </CardContent>
        </Card>
        <Card className={cn("cursor-pointer transition-colors", roleFilter === "employer" ? "border-primary" : "")} onClick={() => handleRoleFilter("employer")}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-2xl font-bold">{stats?.employer || 0}</h3>
            <p className="text-sm text-muted-foreground">Nhà tuyển dụng</p>
          </CardContent>
        </Card>
        <Card className={cn("cursor-pointer transition-colors", roleFilter === "candidate" ? "border-primary" : "")} onClick={() => handleRoleFilter("candidate")}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <User className="w-8 h-8 text-slate-500 mb-2" />
            <h3 className="text-2xl font-bold">{stats?.candidate || 0}</h3>
            <p className="text-sm text-muted-foreground">Ứng viên</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm email hoặc tên ứng viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={6} rows={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead>Tài khoản</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Xác thực</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarImage src={user.avatarUrl} alt={user.email} />
                          <AvatarFallback className="bg-primary/5 text-primary">
                            {user.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{user.candidateProfile?.fullName || "Chưa cập nhật tên"}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {getRoleBadge(user.role)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : user.status === "pending_verification" ? "outline" : "destructive"} 
                             className={cn(user.status === "active" && "bg-emerald-500 hover:bg-emerald-600")}>
                        {user.status === "active" ? "Hoạt động" : user.status === "inactive" ? "Đã khóa" : "Chờ xác thực"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          Email: {user.emailVerified ? <UserCheck className="w-3 h-3 text-emerald-500"/> : <Ban className="w-3 h-3 text-rose-500"/>}
                        </div>
                        <div className="flex items-center gap-1">
                          Phone: {user.phoneVerified ? <UserCheck className="w-3 h-3 text-emerald-500"/> : <Ban className="w-3 h-3 text-rose-500"/>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.status === "active" ? (
                              <><Ban className="w-4 h-4 mr-2 text-rose-500" /> Khóa tài khoản</>
                            ) : (
                              <><UserCheck className="w-4 h-4 mr-2 text-emerald-500" /> Kích hoạt lại</>
                            )}
                          </DropdownMenuItem>
                          {user.role !== "admin" && (
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setConfirmDelete({ id: user.id, email: user.email })}>
                              <Trash2 className="w-4 h-4 mr-2" /> Xóa mềm (Ban)
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        title="Khóa/Xóa mềm tài khoản"
        description={`Tài khoản "${confirmDelete?.email}" sẽ bị vô hiệu hóa và chuyển vào trạng thái Xóa mềm (Deleted At). Người này không thể đăng nhập được nữa. Bạn có chắc chắn?`}
        confirmText="Vô hiệu hóa"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminUsersPage;
