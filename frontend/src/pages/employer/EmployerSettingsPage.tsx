import React from "react";
import { Button } from "@/components/ui/button";

const EmployerSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt tài khoản</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý tài khoản nhà tuyển dụng và cấu hình hệ thống.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h3 className="font-medium text-lg">Đổi mật khẩu</h3>
          <p className="text-sm text-muted-foreground mb-4">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
          <Button variant="outline">Đổi mật khẩu</Button>
        </div>
        <hr className="my-4" />
        <div>
          <h3 className="font-medium text-lg text-destructive">Xóa tài khoản</h3>
          <p className="text-sm text-muted-foreground mb-4">Hành động này không thể hoàn tác.</p>
          <Button variant="destructive">Xóa tài khoản</Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSettingsPage;
