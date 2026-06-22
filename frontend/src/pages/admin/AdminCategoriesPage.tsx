import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  LayoutGrid,
  Layers,
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
const fetchCategories = async () => {
  const { data } = await api.get("/job-categories?limit=1000");
  return data;
};

const createCategory = (payload: { name: string; icon?: string; parentId?: number }) => api.post("/job-categories", payload);
const updateCategory = (id: number, payload: { name?: string; icon?: string; parentId?: number }) => api.patch(`/job-categories/${id}`, payload);
const deleteCategory = (id: number) => api.delete(`/job-categories/${id}`);

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; name: string; icon: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchCategories,
  });

  const items = data?.data || [];
  const filteredItems = items.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));

  const saveMutation = useMutation({
    mutationFn: () => editingItem 
      ? updateCategory(editingItem.id, { name: formData.name, icon: formData.icon }) 
      : createCategory({ name: formData.name, icon: formData.icon }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success(editingItem ? "Đã cập nhật chuyên mục" : "Đã thêm chuyên mục");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Thao tác thất bại. Vui lòng thử lại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Đã xóa chuyên mục");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại. Vui lòng thử lại."),
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, icon: item.icon || "" });
    } else {
      setEditingItem(null);
      setFormData({ name: "", icon: "" });
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
        title="Chuyên mục việc làm"
        subtitle="Quản lý danh mục các loại hình việc làm phục vụ cho việc phân loại và tìm kiếm."
      />

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Số Chuyên Mục</p>
              <h3 className="text-3xl font-bold text-foreground">{items.length}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
              <LayoutGrid className="size-8 text-blue-600" />
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
              placeholder="Tìm kiếm chuyên mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-background border-input/50 rounded-xl focus-visible:ring-primary/20"
            />
          </div>
          <Button onClick={() => handleOpenModal()} className="h-11 rounded-xl shadow-sm gap-2">
            <Plus className="size-4" /> Thêm chuyên mục
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="w-[120px] font-semibold pl-6">ID</TableHead>
                  <TableHead className="font-semibold w-[100px]">Biểu tượng</TableHead>
                  <TableHead className="font-semibold">Tên Chuyên Mục / Slug</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Layers className="size-12 text-muted-foreground/30" />
                        <p className="text-base font-medium">Không tìm thấy chuyên mục nào.</p>
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
                        <div className="flex items-center justify-center size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600">
                          {item.icon ? (
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                          ) : (
                            <LayoutGrid className="size-5 opacity-50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 py-2">
                          <span className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => handleOpenModal(item)}>
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground max-w-[300px] truncate">
                            /{item.slug}
                          </span>
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
                              <Pencil className="mr-2 size-4 text-blue-600" /> Sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa chuyên mục
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
                {editingItem ? "Sửa Chuyên Mục" : "Thêm Chuyên Mục Mới"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1.5">
                {editingItem 
                  ? "Sửa tên hoặc icon của chuyên mục này."
                  : "Tạo danh mục việc làm mới. Bạn có thể tra cứu icon trên Google Fonts Material Symbols."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Tên chuyên mục</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Kinh doanh, Kế toán..."
                  className="h-11 rounded-xl"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-sm font-semibold">Tên Icon (Material Symbols)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="VD: computer, attach_money"
                  className="h-11 rounded-xl font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Nhập tên icon từ <a href="https://fonts.google.com/icons?icon.set=Material+Symbols" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Fonts</a> (ví dụ: `code`).
                </p>
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
        title="Xóa chuyên mục?"
        description={`Bạn có chắc chắn muốn xóa chuyên mục "${confirmDelete?.name}"? Hệ thống sẽ cập nhật lại các tin tuyển dụng liên quan.`}
        confirmLabel="Xóa dữ liệu"
        isDestructive
      />
    </div>
  );
}
