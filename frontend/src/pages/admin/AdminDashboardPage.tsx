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
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

// ─── API ────────────────────────────────────────────────
const fetchDashboardStats = async () => {
  const { data } = await axios.get("/api/v1/admin/stats", { withCredentials: true });
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
      <p className="text-2xl font-black text-foreground mt-0.5 tabular-nums">{value.toLocaleString()}</p>
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
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Page ───────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchDashboardStats,
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
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      sub: `+${stats?.newUsersToday ?? 0} hôm nay`,
    },
    {
      label: "Candidates",
      value: stats?.totalCandidates ?? 0,
      icon: UserCheck,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-500/10",
    },
    {
      label: "Employers",
      value: stats?.totalEmployers ?? 0,
      icon: Briefcase,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      label: "Companies",
      value: stats?.totalCompanies ?? 0,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      badge:
        (stats?.pendingCompanyVerifications ?? 0) > 0
          ? { label: `${stats?.pendingCompanyVerifications} pending`, color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" }
          : undefined,
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? 0,
      icon: Briefcase,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: "Applications",
      value: stats?.totalApplications ?? 0,
      icon: FileText,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-500/10",
    },
    {
      label: "Total Reports",
      value: stats?.totalReports ?? 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
      badge:
        (stats?.pendingReports ?? 0) > 0
          ? { label: `${stats?.pendingReports} pending`, color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" }
          : undefined,
    },
    {
      label: "Activity",
      value: (stats?.userGrowth ?? []).reduce((s: number, d: any) => s + d.value, 0),
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-500/10",
      sub: "New users last 7 days",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-black text-[#0F172A] dark:text-white tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Admin Dashboard</h1>
        <p className="text-[15px] text-[#64748B] dark:text-slate-400 mt-1">
          Tổng quan hệ thống JobFy — cập nhật mỗi 60 giây.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="size-5 text-[#4F46E5]" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Người dùng mới — 7 ngày</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.userGrowth ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name="New Users"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job Growth */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="size-5 text-[#F59E0B]" />
            <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Tin tuyển dụng mới — 7 ngày</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.jobGrowth ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="New Jobs" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Chart Row 2: Applications ── */}
      <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#4F46E5]/5 transition-all duration-300">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="size-5 text-pink-500" />
          <h2 className="font-black text-[17px] text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Lượt ứng tuyển — 7 ngày</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats?.applicationGrowth ?? []} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="value"
              name="Applications"
              stroke="#ec4899"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#ec4899", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
