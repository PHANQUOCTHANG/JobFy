import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const JobAlertsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt Thông báo</h1>
          <p className="text-muted-foreground mt-2">
            Nhận thông báo việc làm phù hợp và các cập nhật mới nhất qua email.
          </p>
        </div>
        <Button>Lưu cài đặt</Button>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Thông báo Việc làm (Job Alerts)</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Việc làm phù hợp với hồ sơ</Label>
              <p className="text-sm text-muted-foreground">Nhận email thông báo khi có việc làm mới phù hợp với kỹ năng của bạn.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Nhà tuyển dụng xem hồ sơ</Label>
              <p className="text-sm text-muted-foreground">Thông báo ngay lập tức khi một công ty xem CV của bạn.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Hệ thống</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Cập nhật tính năng mới</Label>
              <p className="text-sm text-muted-foreground">Nhận tin tức và tính năng mới từ hệ thống.</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlertsPage;
