import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplyJob } from '../hooks/useApplications';
import { useMyResumes } from '@/features/candidates/hooks/useCandidates';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  jobId,
  jobTitle,
  companyName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [resumeId, setResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  
  const { data: resumes, isLoading: isLoadingResumes } = useMyResumes();
  const { mutate: apply, isPending } = useApplyJob();

  const handleApply = () => {
    if (!resumeId) {
      toast.error('Vui lòng chọn một CV để ứng tuyển');
      return;
    }

    apply({ jobId, resumeId, coverLetter }, {
      onSuccess: () => {
        toast.success('Ứng tuyển thành công!');
        onSuccess?.();
        onClose();
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại sau.');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Ứng tuyển công việc</DialogTitle>
          <DialogDescription>
            Bạn đang ứng tuyển vị trí <span className="font-semibold text-foreground">{jobTitle}</span> tại <span className="font-semibold text-foreground">{companyName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Chọn CV ứng tuyển <span className="text-destructive">*</span></label>
            
            {isLoadingResumes ? (
              <div className="h-10 bg-muted animate-pulse rounded-md"></div>
            ) : (!resumes || resumes.length === 0) ? (
              <div className="p-4 border border-dashed rounded-md bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground mb-3">Bạn chưa có CV nào trong hệ thống</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile" onClick={onClose}>Tạo CV ngay</Link>
                </Button>
              </div>
            ) : (
              <Select value={resumeId} onValueChange={setResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Chọn CV của bạn --" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map(resume => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.title} {resume.isPrimary && '(CV Chính)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex justify-between">
              <span>Thư xin việc (Cover Letter)</span>
              <span className="text-muted-foreground font-normal">Không bắt buộc</span>
            </label>
            <Textarea 
              placeholder="Viết đôi lời giới thiệu về bản thân và lý do bạn phù hợp với công việc này..."
              className="resize-none h-32"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Một thư xin việc ấn tượng sẽ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button 
            onClick={handleApply} 
            disabled={isPending || !resumes || resumes.length === 0 || !resumeId}
          >
            {isPending ? 'Đang nộp hồ sơ...' : 'Nộp hồ sơ ứng tuyển'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
