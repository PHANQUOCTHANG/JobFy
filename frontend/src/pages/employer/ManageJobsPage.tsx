import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ManageJobsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tin tuyển dụng</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý tất cả các tin tuyển dụng của công ty bạn.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Tạo tin mới
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">Chưa có tin tuyển dụng nào.</p>
      </div>
    </div>
  );
};

export default ManageJobsPage;
