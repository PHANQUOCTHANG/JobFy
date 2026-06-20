import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// ─── API ─────────────────────────────────────────────────────────
const fetchIndustries = async () => {
  const { data } = await axios.get("/api/v1/industries", { withCredentials: true });
  return data;
};

const createIndustry = (name: string) => axios.post("/api/v1/industries", { name }, { withCredentials: true });
const updateIndustry = (id: number, name: string) => axios.patch(`/api/v1/industries/${id}`, { name }, { withCredentials: true });
const deleteIndustry = (id: number) => axios.delete(`/api/v1/industries/${id}`, { withCredentials: true });

export default function AdminIndustriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "industries"],
    queryFn: fetchIndustries,
  });

  const items = data?.data || [];
  const filteredItems = items.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));

  const saveMutation = useMutation({
    mutationFn: () => editingItem 
      ? updateIndustry(editingItem.id, formData.name) 
      : createIndustry(formData.name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "industries"] });
      toast.success(editingItem ? "Đã cập nhật ngành nghề" : "Đã thêm ngành nghề");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Thao tác thất bại. Vui lòng thử lại."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIndustry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "industries"] });
      toast.success("Đã xóa ngành nghề");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa thất bại. Vui lòng thử lại."),
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name });
    } else {
      setEditingItem(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Ngành nghề kinh doanh"
        subtitle={`Quản lý danh sách ngành nghề trên hệ thống.`}
      />

      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm ngành nghề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="size-4" /> Thêm mới
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên ngành nghề</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-semibold text-sm">{item.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.slug}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenModal(item)}>
                            <Pencil className="mr-2 size-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setConfirmDelete({ id: item.id, name: item.name })}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 size-4" /> Xóa
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

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Sửa ngành nghề" : "Thêm ngành nghề mới"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên ngành nghề</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên ngành nghề"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={saveMutation.isPending || !formData.name.trim()}>Lưu thay đổi</Button>
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
        title="Xóa ngành nghề?"
        description={`Bạn có chắc chắn muốn xóa "${confirmDelete?.name}"? Các công ty thuộc ngành nghề này có thể bị ảnh hưởng.`}
        confirmLabel="Xóa"
        isDestructive
      />
    </div>
  );
}
