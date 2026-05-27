import React, { useState } from 'react';
import { 
  useMyProfile, 
  useUpdateMyProfile,
  useMyResumes,
  CandidateProfileForm,
  ResumeList
} from '@/features/candidates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export const CandidateProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { data: resumes, isLoading: isLoadingResumes } = useMyResumes();

  const handleProfileSubmit = (data: any) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Cập nhật hồ sơ thành công!');
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật hồ sơ.');
      }
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Hồ sơ</h1>
        <p className="text-muted-foreground mt-1">
          Cập nhật thông tin cá nhân và CV để nhà tuyển dụng dễ dàng tìm thấy bạn.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="resumes">Quản lý CV ({resumes?.length || 0})</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Thông tin cơ bản</h3>
            <CandidateProfileForm 
              initialData={profile} 
              onSubmit={handleProfileSubmit}
              isPending={isUpdating}
            />
          </div>
        </TabsContent>

        <TabsContent value="resumes">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <ResumeList 
              resumes={resumes || []} 
              isLoading={isLoadingResumes}
              onAddClick={() => toast.info('Tính năng tạo CV đang phát triển')}
              onEditClick={() => toast.info('Tính năng sửa CV đang phát triển')}
              onDeleteClick={() => toast.info('Tính năng xoá CV đang phát triển')}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-card border rounded-xl p-6 shadow-sm text-center py-12">
            <p className="text-muted-foreground">Tính năng cài đặt bảo mật đang được cập nhật...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateProfilePage;
