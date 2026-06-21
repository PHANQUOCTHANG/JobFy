import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Code2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// ─── API ─────────────────────────────────────────────────────────
const fetchSkills = async () => {
  const { data } = await axios.get("/api/v1/skills", { withCredentials: true });
  return data;
};

const createSkill = (payload: { name: string; description?: string }) => axios.post("/api/v1/skills", payload, { withCredentials: true });
const updateSkill = (id: number, payload: { name?: string; description?: string }) => axios.patch(`/api/v1/skills/${id}`, payload, { withCredentials: true });
const deleteSkill = (id: number) => axios.delete(`/api/v1/skills/${id}`, { withCredentials: true });

export default function AdminSkillsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; name: string; description: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: fetchSkills,
  });

  const items = data?.data || [];
  const filteredItems = items.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));

  const saveMutation = useMutation({
    mutationFn: () => editingItem 
      ? updateSkill(editingItem.id, formData) 
      : createSkill(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "skills"] });
      toast.success(editingItem ? "Đã cập nhật kỹ năng" : "Đã thêm kỹ năng mới");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Thao tác thất bại. Vui lòng thử lại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSkill(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "skills"] });
      toast.success("Đã xóa kỹ năng");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại. Vui lòng thử lại."),
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description || "" });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    saveMutation.mutate();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý Kỹ năng (Skills)"
        subtitle="Quản lý các từ khóa kỹ năng dành cho việc lọc CV và gắn thẻ tin tuyển dụng."
      />

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Số Kỹ Năng</p>
              <h3 className="text-3xl font-bold text-foreground">{items.length}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <Code2 className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:px-6 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kỹ năng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-background border-input/50 rounded-xl focus-visible:ring-primary/20"
            />
          </div>
          <Button onClick={() => handleOpenModal()} className="h-11 rounded-xl shadow-sm gap-2">
            <Plus className="size-4" /> Thêm kỹ năng
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={3} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="w-[120px] font-semibold pl-6">Mã ID</TableHead>
                  <TableHead className="font-semibold">Tên Kỹ Năng / Slug</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Cpu className="size-12 text-muted-foreground/30" />
                        <p className="text-base font-medium">Không tìm thấy kỹ năng nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item: any) => (
                    <TableRow key={item.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                        #{item.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 py-2">
                          <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600">
                            <Code2 className="size-4" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => handleOpenModal(item)}>
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground max-w-[300px] truncate">
                              {item.slug} {item.description && `• ${item.description}`}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-border/50">
                            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">Tùy chọn</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenModal(item)} className="font-medium cursor-pointer">
                              <Pencil className="mr-2 size-4 text-blue-600" /> Cập nhật
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa dữ liệu
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
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border/50 shadow-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold text-foreground">
                {editingItem ? "Cập nhật Kỹ Năng" : "Tạo Kỹ Năng Mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1.5">
                {editingItem 
                  ? "Chỉnh sửa tên hoặc mô tả của kỹ năng này."
                  : "Nhập thông tin cho kỹ năng mới. Ví dụ: ReactJS, Figma, Python..."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Tên kỹ năng</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Node.js"
                  className="h-11 rounded-xl"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Mô tả (Không bắt buộc)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 p-6 border-t border-border/50">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
              <Button type="submit" className="rounded-xl shadow-lg" disabled={saveMutation.isPending || !formData.name.trim()}>
                {saveMutation.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa kỹ năng?"
        description={`Bạn có chắc chắn muốn xóa kỹ năng "${confirmDelete?.name}"? Hệ thống sẽ gỡ bỏ thẻ tag kỹ năng này khỏi các tin tuyển dụng và hồ sơ ứng viên tương ứng.`}
        confirmLabel="Xóa dữ liệu"
        isDestructive
      />
    </div>
  );
}
