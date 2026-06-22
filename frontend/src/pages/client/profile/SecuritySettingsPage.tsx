import React from "react";
import { ProfileLayout } from "./ProfileLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppSelector } from "@/store/hooks";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
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

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export const SecuritySettingsPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SecurityFormValues) => {
    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <ProfileLayout>
      <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Thay đổi mật khẩu đăng nhập</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <FormLabel className="text-slate-700 font-semibold sm:w-1/3 sm:text-right">Email đăng nhập</FormLabel>
              <div className="sm:w-2/3">
                <FormControl>
                  <Input 
                    value={user?.email || ""} 
                    disabled 
                    className="h-11 rounded-lg bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                  />
                </FormControl>
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                  <FormLabel className="text-slate-700 font-semibold sm:w-1/3 sm:text-right sm:mt-3">Mật khẩu hiện tại</FormLabel>
                  <div className="sm:w-2/3">
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu hiện tại" className="h-11 rounded-lg border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                  <FormLabel className="text-slate-700 font-semibold sm:w-1/3 sm:text-right sm:mt-3">Mật khẩu mới</FormLabel>
                  <div className="sm:w-2/3">
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu mới" className="h-11 rounded-lg border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                  <FormLabel className="text-slate-700 font-semibold sm:w-1/3 sm:text-right sm:mt-3">Nhập lại mật khẩu mới</FormLabel>
                  <div className="sm:w-2/3">
                    <FormControl>
                      <Input type="password" placeholder="Nhập lại mật khẩu mới" className="h-11 rounded-lg border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex sm:justify-start sm:pl-[calc(33.333333%+1.5rem)] pt-2">
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
