import React from "react";

const ManageApplicationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý ứng viên</h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi và cập nhật trạng thái hồ sơ ứng viên.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">Chưa có ứng viên nào.</p>
      </div>
    </div>
  );
};

export default ManageApplicationsPage;
