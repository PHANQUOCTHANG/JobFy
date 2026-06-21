import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminCandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
  onSave: (id: string, data: any) => void;
  isPending: boolean;
}

export default function AdminCandidateFormModal({
  isOpen,
  onClose,
  candidate,
  onSave,
  isPending,
}: AdminCandidateFormModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    bio: "",
    desiredJobTitle: "",
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        fullName: candidate.fullName || "",
        headline: candidate.headline || "",
        bio: candidate.bio || "",
        desiredJobTitle: candidate.desiredJobTitle || "",
      });
    }
  }, [candidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;
    onSave(candidate.id, formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-foreground">Sửa thông tin Ứng viên</DialogTitle>
          <DialogDescription className="text-sm">
            Bạn đang sửa hồ sơ của <span className="font-semibold text-foreground">{candidate?.fullName}</span>. Các thay đổi này sẽ áp dụng trực tiếp lên hệ thống.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Họ và tên ứng viên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Chức danh / Headline</Label>
            <Input
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="VD: Senior Frontend Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredJobTitle">Công việc mong muốn</Label>
            <Input
              id="desiredJobTitle"
              name="desiredJobTitle"
              value={formData.desiredJobTitle}
              onChange={handleChange}
              placeholder="VD: Frontend Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu ngắn (Bio)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Mô tả về ứng viên..."
              className="resize-none h-24"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-border/50 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
