import React from "react";
import { BarChart, Users, Briefcase, Eye } from "lucide-react";

const EmployerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan số liệu tuyển dụng của công ty bạn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tin tuyển dụng (Active)</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="size-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CV chờ duyệt</p>
              <h3 className="text-2xl font-bold">48</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Eye className="size-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lượt xem tin</p>
              <h3 className="text-2xl font-bold">2,405</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
