import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ShieldOff, LogIn } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { ThemedLoader } from "@/components/ui/ThemedLoader";

/**
 * AdminRoute
 * ─────────────────────────────────────────────────────────────
 * 1. Đang kiểm tra auth (F5 / refreshToken)  → Hiện Loader
 * 2. Chưa đăng nhập                           → Redirect về /admin/login
 * 3. Đã đăng nhập nhưng KHÔNG phải admin      → Hiện màn hình 403
 * 4. Đã đăng nhập + là admin                  → Render <Outlet />
 */
const AdminRoute: React.FC = () => {
  const { token, user, isAuthChecking } = useAppSelector((state) => state.auth);

  // 1. Đang xác thực
  if (isAuthChecking) {
    return <ThemedLoader />;
  }

  // 2. Chưa đăng nhập → về trang login riêng của admin
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Đã đăng nhập nhưng không phải admin → 403 screen
  if (user.role !== "admin") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-6"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        {/* Icon block */}
        <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
          <ShieldOff className="size-9 text-red-400" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            Quyền truy cập bị từ chối
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Tài khoản <span className="font-semibold text-slate-700">{user.email}</span> không có quyền truy cập khu vực quản trị.
            Vui lòng đăng nhập bằng tài khoản Admin để tiếp tục.
          </p>
        </div>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Role hiện tại: {user.role}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            ← Trang chủ
          </a>
          <a
            href="/admin/login"
            className="px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-[#4338CA] transition-all flex items-center gap-2 shadow-md shadow-[#4F46E5]/25"
          >
            <LogIn size={14} />
            Đăng nhập Admin
          </a>
        </div>
      </div>
    );
  }

  // 4. Hợp lệ → render children
  return <Outlet />;
};

export default AdminRoute;
