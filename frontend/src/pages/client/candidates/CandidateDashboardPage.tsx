import React from "react";
import { Briefcase, Eye, Heart, FileText } from "lucide-react";

const CandidateDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan về hoạt động tìm việc của bạn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã ứng tuyển</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Heart className="size-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Việc làm đã lưu</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Eye className="size-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lượt xem hồ sơ</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <FileText className="size-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CV đã tạo</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Hoạt động gần đây</h3>
          <p className="text-sm text-muted-foreground">Bạn chưa có hoạt động nào nổi bật trong tuần qua.</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Mức độ hoàn thiện hồ sơ</h3>
          <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-sm text-muted-foreground text-right">65%</p>
          <p className="text-sm text-muted-foreground mt-2">Cập nhật thêm thông tin học vấn và kinh nghiệm để thu hút nhà tuyển dụng.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
