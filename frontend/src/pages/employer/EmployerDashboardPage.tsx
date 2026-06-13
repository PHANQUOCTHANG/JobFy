import React from "react";
import {
  Calendar,
  FileText,
  Eye,
  Briefcase,
  PieChart,
  TrendingUp,
  MoreVertical,
  MoreHorizontal
} from "lucide-react";

const EmployerDashboardPage = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tổng quan Bảng điều khiển</h2>
          <p className="text-lg text-muted-foreground mt-1">Theo dõi hiệu suất tuyển dụng và tiến trình xử lý.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border text-primary text-sm font-medium rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            <Calendar className="size-[18px]" />
            30 ngày qua
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="size-10 text-primary" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hồ sơ mới</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-foreground">24</h3>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1 mb-1">
              <TrendingUp className="size-3" />
              +12% tuần
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="size-10 text-primary" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lượt xem tin</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-foreground">1,240</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="size-10 text-primary" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tin đang mở</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-foreground">8</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart className="size-10 text-primary" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hạn mức tin</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-foreground">2/10</h3>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "20%" }}></div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart Mockup */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-foreground">Xu hướng ứng tuyển</h3>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <MoreVertical className="size-5" />
            </button>
          </div>
          <div className="flex-1 min-h-[250px] relative border-b border-l border-border/50 ml-8 pb-4">
            {/* Grid Lines */}
            <div className="absolute w-full h-full flex flex-col justify-between opacity-10">
              <div className="w-full border-t border-border"></div>
              <div className="w-full border-t border-border"></div>
              <div className="w-full border-t border-border"></div>
              <div className="w-full border-t border-border"></div>
            </div>
            {/* Mock Line Chart SVG */}
            <svg className="absolute bottom-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Area */}
              <path className="opacity-20 text-primary" d="M0,100 L0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50 L100,100 Z" fill="currentColor"></path>
              {/* Line */}
              <path className="text-primary drop-shadow-md" d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50" fill="none" stroke="currentColor" strokeWidth="2"></path>
              {/* Data Points */}
              <circle className="text-primary hover:r-4 transition-all cursor-pointer" cx="20" cy="85" fill="currentColor" r="3"></circle>
              <circle className="text-primary hover:r-4 transition-all cursor-pointer" cx="40" cy="60" fill="currentColor" r="3"></circle>
              <circle className="text-primary hover:r-4 transition-all cursor-pointer" cx="60" cy="75" fill="currentColor" r="3"></circle>
              <circle className="text-primary hover:r-4 transition-all cursor-pointer" cx="80" cy="40" fill="currentColor" r="3"></circle>
              <circle className="text-primary hover:r-4 transition-all cursor-pointer" cx="100" cy="50" fill="currentColor" r="3"></circle>
            </svg>
            {/* Y Axis Labels */}
            <div className="absolute -left-8 h-full flex flex-col justify-between text-[11px] font-medium text-muted-foreground pb-4">
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
            </div>
            {/* X Axis Labels */}
            <div className="absolute -bottom-6 w-full flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>T1</span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>Hiện tại</span>
            </div>
          </div>
        </div>

        {/* Funnel Chart Mockup */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-foreground">Phễu tuyển dụng</h3>
            <span className="text-[11px] font-medium bg-accent text-foreground px-2 py-1 rounded-md">YTD</span>
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {/* Funnel Stage 1 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-24 text-right text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">Chờ duyệt</div>
              <div className="flex-1 h-10 bg-primary/10 rounded-r-lg relative overflow-hidden group-hover:bg-primary/20 transition-colors" style={{ width: "100%" }}>
                <div className="absolute inset-y-0 left-0 bg-primary w-2"></div>
                <div className="absolute inset-0 flex items-center px-4 font-bold text-primary text-sm">150</div>
              </div>
            </div>
            {/* Funnel Stage 2 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-24 text-right text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">Đang xem xét</div>
              <div className="flex-1 h-10 bg-primary/10 rounded-r-lg relative overflow-hidden group-hover:bg-primary/20 transition-colors" style={{ width: "75%" }}>
                <div className="absolute inset-y-0 left-0 bg-primary w-2 opacity-80"></div>
                <div className="absolute inset-0 flex items-center px-4 font-bold text-primary text-sm">85</div>
              </div>
              <div className="w-10 text-[11px] text-muted-foreground">56%</div>
            </div>
            {/* Funnel Stage 3 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-24 text-right text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">Đã phỏng vấn</div>
              <div className="flex-1 h-10 bg-primary/10 rounded-r-lg relative overflow-hidden group-hover:bg-primary/20 transition-colors" style={{ width: "45%" }}>
                <div className="absolute inset-y-0 left-0 bg-primary w-2 opacity-60"></div>
                <div className="absolute inset-0 flex items-center px-4 font-bold text-primary text-sm">32</div>
              </div>
              <div className="w-10 text-[11px] text-muted-foreground">37%</div>
            </div>
            {/* Funnel Stage 4 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-24 text-right text-xs font-semibold text-muted-foreground group-hover:text-emerald-500 transition-colors">Đề nghị</div>
              <div className="flex-1 h-10 bg-emerald-500/10 rounded-r-lg relative overflow-hidden group-hover:bg-emerald-500/20 transition-colors" style={{ width: "20%" }}>
                <div className="absolute inset-y-0 left-0 bg-emerald-500 w-2"></div>
                <div className="absolute inset-0 flex items-center px-4 font-bold text-emerald-600 text-sm">8</div>
              </div>
              <div className="w-10 text-[11px] text-muted-foreground">25%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">Hồ sơ gần đây</h3>
          <a className="text-primary text-sm font-medium hover:underline" href="#">Xem tất cả</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">Ứng viên</th>
                <th className="py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">Vị trí ứng tuyển</th>
                <th className="py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">Trạng thái</th>
                <th className="py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">Ngày</th>
                <th className="py-3 px-6 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {/* Row 1 */}
              <tr className="border-b border-border hover:bg-accent/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Jane Doe</p>
                      <p className="text-[11px] text-muted-foreground font-normal">jane.doe@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-foreground">Senior Frontend Engineer</td>
                <td className="py-4 px-6">
                  <span className="bg-muted text-foreground px-3 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary"></span>
                    Đang xem xét
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">2 giờ trước</td>
                <td className="py-4 px-6 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <Eye className="size-5" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-border hover:bg-accent/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                      MS
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Michael Smith</p>
                      <p className="text-[11px] text-muted-foreground font-normal">m.smith@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-foreground">Product Manager</td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    Đã phỏng vấn
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">Hôm qua</td>
                <td className="py-4 px-6 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <Eye className="size-5" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-accent/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center font-bold">
                      AL
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Anna Lee</p>
                      <p className="text-[11px] text-muted-foreground font-normal">anna.l@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-foreground">UX Designer</td>
                <td className="py-4 px-6">
                  <span className="bg-border/30 text-foreground px-3 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-muted-foreground"></span>
                    Chờ duyệt
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground">12 Th10, 2023</td>
                <td className="py-4 px-6 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <Eye className="size-5" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
