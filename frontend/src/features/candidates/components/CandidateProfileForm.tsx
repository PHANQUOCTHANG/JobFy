import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CandidateProfile } from '../types';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  headline: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().optional(),
  desiredJobTitle: z.string().optional(),
  experienceLevel: z.string().optional(),
  linkedinUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  githubUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CandidateProfileFormProps {
  initialData?: CandidateProfile;
  onSubmit: (data: Partial<CandidateProfile>) => void;
  isPending?: boolean;
}

export const CandidateProfileForm: React.FC<CandidateProfileFormProps> = ({ 
  initialData, 
  onSubmit, 
  isPending 
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      headline: initialData?.headline || '',
      gender: initialData?.gender || 'prefer_not_to_say',
      bio: initialData?.bio || '',
      desiredJobTitle: initialData?.desiredJobTitle || '',
      experienceLevel: initialData?.experienceLevel || 'fresher',
      linkedinUrl: initialData?.linkedinUrl || '',
      githubUrl: initialData?.githubUrl || '',
    },
  });

  const handleSubmit = (values: ProfileFormValues) => {
    onSubmit(values as unknown as Partial<CandidateProfile>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên *</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề nghề nghiệp (Headline)</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer tại..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                    <SelectItem value="prefer_not_to_say">Không muốn tiết lộ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cấp bậc kinh nghiệm</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp bậc" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="intern">Thực tập sinh</SelectItem>
                    <SelectItem value="fresher">Mới tốt nghiệp</SelectItem>
                    <SelectItem value="junior">Junior (Dưới 2 năm)</SelectItem>
                    <SelectItem value="mid">Mid-level (2-4 năm)</SelectItem>
                    <SelectItem value="senior">Senior (Trên 5 năm)</SelectItem>
                    <SelectItem value="lead">Team Lead</SelectItem>
                    <SelectItem value="manager">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="desiredJobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Công việc mong muốn</FormLabel>
                <FormControl>
                  <Input placeholder="React Developer..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu bản thân (Bio)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Mô tả ngắn gọn về bản thân, kỹ năng và mục tiêu nghề nghiệp..." 
                  className="resize-none h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
