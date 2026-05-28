import React from "react";
import { Button } from "@/components/ui/button";

const ManageCompanyPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ công ty</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin công ty để thu hút ứng viên.
          </p>
        </div>
        <Button>Lưu thay đổi</Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">Form thông tin công ty đang được xây dựng...</p>
      </div>
    </div>
  );
};

export default ManageCompanyPage;
