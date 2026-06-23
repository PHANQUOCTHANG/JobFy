import React, { useEffect } from "react";
import { ProfileLayout } from "./ProfileLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppSelector } from "@/store/hooks";
import { useMyProfile, useUpdateMyProfile } from "@/features/candidates/hooks/useCandidates";
import { useUpdateMe } from "@/features/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileSettingsPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useMyProfile();
  
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateMyProfile();
  const { mutate: updateMe, isPending: isUpdatingMe } = useUpdateMe();

  const isPending = isUpdatingProfile || isUpdatingMe;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  // Load initial data
  useEffect(() => {
    if (profile || user) {
      form.reset({
        fullName: profile?.fullName || user?.fullName || "",
        phone: user?.phone || "",
      });
    }
  }, [profile, user, form]);

  const onSubmit = (values: ProfileFormValues) => {
    // Update CandidateProfile name
    if (values.fullName !== profile?.fullName) {
      updateProfile({ fullName: values.fullName });
    }
    
    // Update User phone
    if (values.phone !== user?.phone) {
      updateMe({ phone: values.phone });
    }
  };

  return (
    <ProfileLayout>
      <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Cài đặt thông tin cá nhân</h2>
        <p className="text-sm text-red-500 mb-6 font-medium">(*) Các thông tin bắt buộc</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Họ và tên <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" className="h-11 rounded-lg border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" className="h-11 rounded-lg border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
              <FormControl>
                <Input 
                  value={user?.email || ""} 
                  disabled 
                  className="h-11 rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                />
              </FormControl>
            </FormItem>

            <div className="pt-2">
              <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 h-11 rounded-lg">
                {isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ProfileLayout>
  );
};
