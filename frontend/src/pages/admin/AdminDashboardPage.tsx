import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Activity,
  Banknote,
  Crown,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import api from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── API ────────────────────────────────────────────────
const fetchDashboardStats = async (days: number) => {
  const { data } = await api.get(`/admin/stats?days=${days}`);
  return data.data ?? data;
};

// ─── Stat Card ───────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub?: string;
  badge?: { label: string; color: string };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bg, sub, badge }) => (
  <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
    <div className={`${bg} ${color} p-3 rounded-xl shrink-0`}>
      <Icon className="size-5" />
    </div>
    <div className="min-w-0" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-foreground mt-0.5 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
    {badge && (
      <span className={`ml-auto shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    )}
  </div>
);

// ─── Custom Tooltip ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="font-bold text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey || p.name} style={{ color: p.color || p.payload.fill }}>
            {p.name}: <span className="font-semibold">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Colors for Pie Charts ───────────────────────────────
const ROLE_COLORS = ["#6366f1", "#f97316"]; // Candidate (Indigo), Employer (Orange)
const STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#64748b", "#8b5cf6"]; // Published, Pending, Rejected, Draft, etc.

// ─── Main Page ───────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats", days],
    queryFn: () => fetchDashboardStats(days),
    refetchInterval: 60_000, // refresh every 60s
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-2xl h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-muted rounded-2xl h-72" />
          <div className="bg-muted rounded-2xl h-72" />
        </div>
      </div>
    );
  }

  const statCards: StatCardProps[] = [
    {
      label: "Tổng Doanh Thu",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue ?? 0),
      icon: Banknote,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-500/10",
      sub: "Từ các gói Subscriptions",
    },
    {
      label: "Tổng Người Dùng",
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      sub: `+${stats?.newUsersToday ?? 0} hôm nay`,
    },
    {
      label: "Doanh Nghiệp",
      value: (stats?.totalCompanies ?? 0).toLocaleString(),
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge:
        (stats?.pendingCompanyVerifications ?? 0) > 0
          ? { label: `${stats?.pendingCompanyVerifications} chờ duyệt`, color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" }
          : undefined,
    },
    {
      label: "Tin Tuyển Dụng",
      value: (stats?.totalJobs ?? 0).toLocaleString(),
      icon: Briefcase,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: "Lượt Ứng Tuyển",
      value: (stats?.totalApplications ?? 0).toLocaleString(),
      icon: FileText,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-500/10",
    },
    {
      label: "Lượt Báo Cáo",
      value: (stats?.totalReports ?? 0).toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
      badge:
        (stats?.pendingReports ?? 0) > 0
          ? { label: `${stats?.pendingReports} chờ duyệt`, color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" }
          : undefined,
    },
    {
      label: "Hoạt Động",
      value: (stats?.userGrowth ?? []).reduce((s: number, d: any) => s + d.value, 0).toLocaleString(),
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-500/10",
      sub: `Người dùng mới trong ${days} ngày qua`,
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] dark:text-white tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Bảng điều khiển Admin</h1>
          <p className="text-[15px] text-[#64748B] dark:text-slate-400 mt-1">
            Tổng quan hệ thống JobFy — cập nhật mỗi 60 giây.
          </p>
        </div>
        <div className="w-48">
          <Select value={days.toString()} onValueChange={(val) => setDays(Number(val))}>
            <SelectTrigger className="h-11 rounded-xl bg-background border-[#E2E8F0] dark:border-slate-800 shadow-sm">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl">
              <SelectItem value="7">7 ngày qua</SelectItem>
              <SelectItem value="30">30 ngày qua</SelectItem>
              <SelectItem value="90">3 tháng qua</SelectItem>
              <SelectItem value="365">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Revenue Chart ── */}
      <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
        <div className="flex items-center gap-2 mb-5">
          <Banknote className="size-5 text-green-600" />
          <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Biểu đồ Doanh Thu — {days} ngày</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats?.revenueGrowth ?? []} margin={{ top: 4, right: 16, bottom: 0, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
              tickFormatter={(val) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              name="Doanh thu (VND)"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="size-5 text-[#4F46E5]" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Người dùng mới — {days} ngày</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats?.userGrowth ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name="Người dùng mới"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Growth */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="size-5 text-pink-500" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Lượt ứng tuyển — {days} ngày</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.applicationGrowth ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Lượt ứng tuyển" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2: Distributions & Top Recruiters ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Role Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-2">
            <UserCheck className="size-5 text-indigo-500" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Phân bổ Người Dùng</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats?.roleDistribution ?? []}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats?.roleDistribution ?? []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-2">
            <Briefcase className="size-5 text-orange-500" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Trạng thái Việc Làm</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats?.jobStatusDistribution ?? []}
                cx="50%" cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {(stats?.jobStatusDistribution ?? []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Companies */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Crown className="size-5 text-yellow-500" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Top Nhà Tuyển Dụng</h2>
          </div>
          <div className="space-y-4">
            {(stats?.topCompanies ?? []).map((company: any, i: number) => (
              <div key={company.id} className="flex items-center gap-4">
                <div className="font-bold text-muted-foreground w-4 text-center">{i + 1}</div>
                <Avatar className="size-10 border shadow-sm rounded-lg">
                  <AvatarImage src={company.logoUrl || ""} className="object-cover" />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {company.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.totalJobs} tin tuyển dụng</p>
                </div>
              </div>
            ))}
            {(stats?.topCompanies?.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
