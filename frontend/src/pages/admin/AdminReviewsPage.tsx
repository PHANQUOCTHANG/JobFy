import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Star,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Building2,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── API ─────────────────────────────────────────────────────────
const fetchReviews = async (params: Record<string, any>) => {
  const { data } = await axios.get("/api/v1/company-reviews", { params, withCredentials: true });
  return data;
};

const deleteReviewApi = (id: string) =>
  axios.delete(`/api/v1/company-reviews/${id}`, { withCredentials: true });

// ─── Main ─────────────────────────────────────────────────────────
export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

  const params = {
    page,
    limit: 15,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: () => fetchReviews(params),
  });

  const reviews: any[] = data?.data ?? [];
  const meta = data?.meta ?? { totalItems: 0, totalPages: 1, page: 1 };

  // Fetch stats for cards
  const { data: statsData } = useQuery({
    queryKey: ["admin", "reviews", "stats"],
    queryFn: async () => {
      const all = await fetchReviews({ limit: 1 });
      return {
        total: all.meta?.totalItems || 0,
      };
    },
    refetchInterval: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReviewApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Đã xóa đánh giá thành công.");
      setConfirmDelete(null);
    },
    onError: () => toast.error("Xóa đánh giá thất bại."),
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-3.5 ${
          i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30 fill-muted/30"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Quản lý Đánh giá Công ty"
        subtitle="Theo dõi và kiểm duyệt các đánh giá (Reviews) từ người dùng về các nhà tuyển dụng."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm border-border/50 overflow-hidden group hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tổng Lượt Đánh Giá</p>
              <h3 className="text-3xl font-bold text-foreground">{statsData?.total ?? "..."}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <MessageSquare className="size-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 shadow-sm rounded-2xl overflow-hidden">
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
                  <TableHead className="font-semibold pl-6 w-[250px]">Người đánh giá</TableHead>
                  <TableHead className="font-semibold w-[250px]">Công ty</TableHead>
                  <TableHead className="font-semibold w-[120px]">Rating</TableHead>
                  <TableHead className="font-semibold">Nội dung</TableHead>
                  <TableHead className="text-right font-semibold pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <MessageSquare className="size-16 text-muted-foreground/30" />
                        <p className="text-base font-medium">Chưa có đánh giá nào trên hệ thống.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id} className="group hover:bg-muted/20 border-b border-border/50 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border shadow-sm rounded-full">
                            <AvatarImage src={review.user?.avatarUrl || ""} className="object-cover" />
                            <AvatarFallback className="font-bold bg-primary/10 text-primary">
                              {review.user?.email ? review.user.email.charAt(0).toUpperCase() : <User className="size-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground">
                              {review.user?.fullName || "Ẩn danh"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {review.user?.email || "Không rõ"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-lg">
                            <Building2 className="size-4 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground truncate max-w-[150px]">
                              {review.company?.name || "Company"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2">
                          <p className="text-sm font-semibold text-foreground max-w-[350px] line-clamp-1">
                            {review.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-[350px] line-clamp-2">
                            {review.content}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border/50">
                            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">Công cụ Admin</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              onClick={() => setConfirmDelete({ id: review.id })}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" /> Xóa vi phạm (Spam/Toxic)
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

      {/* Confirm modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        isLoading={deleteMutation.isPending}
        title="Xóa đánh giá này?"
        description="Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này? Hành động này thường chỉ nên áp dụng cho các đánh giá vi phạm tiêu chuẩn cộng đồng (chửi bới, spam, bôi nhọ vô căn cứ)."
        confirmLabel="Xóa vi phạm"
        isDestructive
      />
    </div>
  );
}
