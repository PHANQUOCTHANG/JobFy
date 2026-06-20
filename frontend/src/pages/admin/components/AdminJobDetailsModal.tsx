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
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Banknote, 
  Calendar,
  CheckCircle,
  XCircle
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
      <SheetContent side="right" className="w-[100vw] sm:max-w-[600px] overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="p-6 border-b bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4 pr-6">
            <div className="space-y-2">
              <SheetTitle className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {job.title}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <Building2 className="size-4" />
                <span className="font-medium text-foreground">{job.company?.name || "Công ty chưa cập nhật"}</span>
              </SheetDescription>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "capitalize shadow-none whitespace-nowrap",
                job.status === "pending" ? "bg-amber-500/15 text-amber-600 border-amber-500/20" : "",
                job.status === "published" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : "",
                job.status === "rejected" ? "bg-red-500/15 text-red-600 border-red-500/20" : "",
              )}
            >
              {job.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 p-6 space-y-8">
          {/* Grid thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5" /> Địa điểm</p>
              <p className="font-medium text-sm">{job.address || "Chưa cập nhật"} {job.isRemote && "(Remote)"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Briefcase className="size-3.5" /> Loại hình</p>
              <p className="font-medium text-sm capitalize">{job.jobType?.replace("_", " ")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Banknote className="size-3.5" /> Mức lương</p>
              <p className="font-medium text-sm text-emerald-600">
                {job.isSalaryPublic ? (
                  job.salaryMin && job.salaryMax 
                    ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
                    : "Thỏa thuận"
                ) : "Thỏa thuận"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar className="size-3.5" /> Hết hạn</p>
              <p className="font-medium text-sm">
                {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("vi-VN") : "Không thời hạn"}
              </p>
            </div>
          </div>

          {/* Lý do từ chối nếu có */}
          {job.status === "rejected" && job.rejectedReason && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Lý do từ chối:</p>
              <p className="text-sm text-red-800 dark:text-red-300">{job.rejectedReason}</p>
            </div>
          )}

          {/* Kỹ năng */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Kỹ năng yêu cầu</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s: any) => (
                  <Badge key={s.id} variant="secondary" className="font-normal">{s.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mô tả chi tiết */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Mô tả công việc</h3>
            <div 
              className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }} 
            />
          </div>

          {job.requirements && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Yêu cầu ứng viên</h3>
              <div 
                className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: job.requirements }} 
              />
            </div>
          )}

          {job.benefits && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Quyền lợi</h3>
              <div 
                className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: job.benefits }} 
              />
            </div>
          )}
        </div>

        {/* Nút thao tác nhanh (Chỉ hiển thị khi pending) */}
        {job.status === "pending" && (
          <SheetFooter className="p-4 border-t bg-background mt-auto sticky bottom-0">
            <div className="flex items-center gap-3 w-full sm:justify-end">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:hover:bg-red-500/10"
                onClick={() => onReject(job.id)}
                disabled={isPending}
              >
                <XCircle className="size-4 mr-2" /> Từ chối
              </Button>
              <Button 
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                onClick={() => onApprove(job.id)}
                disabled={isPending}
              >
                <CheckCircle className="size-4 mr-2" /> Duyệt tin này
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminJobDetailsModal;
