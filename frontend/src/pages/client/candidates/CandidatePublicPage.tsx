import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  useCandidateProfile,
  useCandidateResumes,
  CandidatePublicHeader,
  ResumeList
} from '@/features/candidates';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const CandidatePublicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: profile, isLoading: isLoadingProfile } = useCandidateProfile(id || '');
  const { data: resumes, isLoading: isLoadingResumes } = useCandidateResumes(id || '');

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Skeleton className="h-48 w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy ứng viên</h2>
        <p className="text-muted-foreground mb-6">Hồ sơ này không tồn tại hoặc ứng viên đã ẩn hồ sơ.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div>
        <Button variant="ghost" onClick={() => window.history.back()} className="-ml-4 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <CandidatePublicHeader profile={profile} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Giới thiệu bản thân</h3>
            <div className="prose max-w-none dark:prose-invert">
              {profile.bio ? (
                <p className="whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">Ứng viên chưa cập nhật phần giới thiệu.</p>
              )}
            </div>
          </section>

          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">CV & Hồ sơ đính kèm</h3>
            <ResumeList 
              resumes={resumes || []} 
              isLoading={isLoadingResumes}
              isPublicView={true}
            />
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h4 className="font-bold mb-4">Thông tin thêm</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Công việc mong muốn</span>
                <span className="font-medium text-right">{profile.desiredJobTitle || 'Chưa cập nhật'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Kinh nghiệm</span>
                <span className="font-medium capitalize">{profile.experienceLevel?.replace('_', ' ') || 'Chưa cập nhật'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Mức lương</span>
                <span className="font-medium">Thỏa thuận</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePublicPage;
