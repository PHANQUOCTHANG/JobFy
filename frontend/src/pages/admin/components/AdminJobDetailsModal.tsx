import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Banknote, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminJobDetailsModalProps {
  job: any | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isPending?: boolean;
}

const AdminJobDetailsModal: React.FC<AdminJobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isPending
}) => {
  if (!job) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[100vw] sm:max-w-[700px] overflow-y-auto p-0 flex flex-col bg-slate-50/50 dark:bg-background">
        <SheetHeader className="p-6 sm:p-8 border-b bg-white dark:bg-card sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 rounded-xl border shadow-sm bg-white shrink-0 mt-1">
                <AvatarImage src={job.company?.logoUrl || ""} className="object-contain p-1" />
                <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary text-xl">
                  {job.company?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <SheetTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                  {job.title}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-base font-medium">
                  <Building2 className="size-4.5 text-primary" />
                  <span className="text-foreground/90">{job.company?.name || "Công ty ẩn danh"}</span>
                </SheetDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "capitalize shadow-none whitespace-nowrap text-xs font-bold px-3 py-1 self-start",
                job.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "",
                job.status === "published" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "",
                job.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/30" : "",
                job.status === "draft" ? "bg-muted text-muted-foreground border-border" : "",
              )}
            >
              {job.status === "pending" ? "Chờ duyệt" : job.status === "published" ? "Đang hiển thị" : job.status === "rejected" ? "Bị từ chối" : job.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 p-6 sm:p-8 space-y-10">
          {/* Lý do từ chối nếu có */}
          {job.status === "rejected" && job.rejectedReason && (
            <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
                <XCircle className="size-5" />
                Lý do từ chối hiển thị:
              </div>
              <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed font-medium">{job.rejectedReason}</p>
            </div>
          )}

          {/* Grid thông tin cơ bản */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b pb-2">Thông tin chung</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5" /> Địa điểm</p>
                <p className="font-semibold text-sm line-clamp-2">{job.address || "Chưa cập nhật"} {job.isRemote && <span className="text-primary">(Remote)</span>}</p>
              </div>
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Briefcase className="size-3.5" /> Loại hình</p>
                <p className="font-semibold text-sm capitalize">{job.jobType?.replace("_", " ")}</p>
              </div>
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Banknote className="size-3.5" /> Mức lương</p>
                <p className="font-bold text-sm text-emerald-600">
                  {job.isSalaryPublic ? (
                    job.salaryMin && job.salaryMax 
                      ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
                      : "Thỏa thuận"
                  ) : "Thỏa thuận"}
                </p>
              </div>
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Layers className="size-3.5" /> Số lượng tuyển</p>
                <p className="font-semibold text-sm">{job.quantity || 1} người</p>
              </div>
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><GraduationCap className="size-3.5" /> Kinh nghiệm</p>
                <p className="font-semibold text-sm capitalize">{job.experienceLevel || "Không yêu cầu"}</p>
              </div>
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Calendar className="size-3.5" /> Hạn nộp hồ sơ</p>
                <p className="font-semibold text-sm text-amber-600">
                  {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("vi-VN") : "Không thời hạn"}
                </p>
              </div>
            </div>
          </div>

          {/* Kỹ năng */}
          {job.jobSkills && job.jobSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b pb-2">Kỹ năng yêu cầu</h3>
              <div className="flex flex-wrap gap-2">
                {job.jobSkills.map((js: any) => (
                  <Badge key={js.skill.id} variant="secondary" className="px-3 py-1 text-sm bg-secondary border shadow-sm font-semibold">
                    {js.skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mô tả chi tiết */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b pb-2">Mô tả công việc</h3>
            <div 
              className="text-[15px] text-foreground/90 whitespace-pre-wrap leading-relaxed prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm"
              dangerouslySetInnerHTML={{ __html: job.description }} 
            />
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b pb-2">Yêu cầu ứng viên</h3>
              <div 
                className="text-[15px] text-foreground/90 whitespace-pre-wrap leading-relaxed prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm"
                dangerouslySetInnerHTML={{ __html: job.requirements }} 
              />
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b pb-2">Quyền lợi</h3>
              <div 
                className="text-[15px] text-foreground/90 whitespace-pre-wrap leading-relaxed prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm"
                dangerouslySetInnerHTML={{ __html: job.benefits }} 
              />
            </div>
          )}
        </div>

        {/* Nút thao tác nhanh (Chỉ hiển thị khi pending) */}
        {job.status === "pending" && (
          <SheetFooter className="p-4 sm:p-6 border-t bg-white dark:bg-card mt-auto sticky bottom-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 w-full justify-end">
              <Button 
                variant="outline" 
                className="h-12 px-6 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:hover:bg-red-500/10 font-bold"
                onClick={() => onReject(job.id)}
                disabled={isPending}
              >
                <XCircle className="size-5 mr-2" /> TỪ CHỐI DUYỆT
              </Button>
              <Button 
                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 font-bold"
                onClick={() => onApprove(job.id)}
                disabled={isPending}
              >
                <CheckCircle className="size-5 mr-2" /> XUẤT BẢN TIN NÀY
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminJobDetailsModal;
