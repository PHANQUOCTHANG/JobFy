import { ThemedLoader } from "@/components/ui/ThemedLoader";
import AppResult from "@/components/ui/Result";
import { useAppSelector } from "@/store/hooks";
import { AlertCircle, LogInIcon } from "lucide-react";
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

/**
 * ✅ ProtectedRoute
 * - Bảo vệ route yêu cầu đăng nhập
 * - Có thể giới hạn role: admin, teacher, student, ...
 */
const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({
  requiredRole,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, isAuthChecking } = useAppSelector((state) => state.auth);

  // 1️⃣ Đang xác thực hoặc đang trong quá trình khôi phục dữ liệu từ LocalStorage (Hydration)
  if (isAuthChecking || (token && !user)) {
    return <ThemedLoader />;
  }

  // 2️⃣ Chưa đăng nhập → yêu cầu login
  if (!token) {
    return (
      <div className="section-container min-h-screen flex items-center justify-center">
        <AppResult
          variant="no-permission"
          title="Yêu cầu đăng nhập"
          description="Vui lòng đăng nhập để truy cập nội dung này."
          action={{
            label: "Đăng nhập",
            icon: LogInIcon,
            onClick: () => {
              // Tối ưu: Chuyển về đúng trang login của role yêu cầu
              const loginPath = requiredRole === "employer" ? "/employer/login" : "/login";
              navigate(loginPath);
            },
            variant: "primary",
          }}
        />
      </div>
    );
  }
  if (user?.mustChangePassword && location.pathname !== "/force-change-password") {
    return (
      <div className="section-container min-h-screen flex items-center justify-center">
        <AppResult
          variant="custom"
          icon={AlertCircle}
          title="Cảnh báo bảo mật"
          wave="--wave-4"
          description="Bạn phải đổi mật khẩu lần đầu để đảm bảo an toàn."
          action={{
            label: "Đổi mật khẩu",
            icon: LogInIcon,
            onClick: () => {
              navigate("/force-change-password");
            },
            variant: "primary",
          }}
        />
      </div>
    );
  }
  // 3️⃣ Kiểm tra role (nếu route có yêu cầu)
  // Chuyển role về chữ thường để so sánh chính xác hơn
  if (
    requiredRole && 
    user?.role?.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return (
      <div className="section-container min-h-screen flex items-center justify-center">
        <AppResult
          variant="no-permission"
          action={{
            label: "Quay lại trang chủ",
            icon: LogInIcon,
            onClick: () => navigate("/"),
            variant: "primary",
          }}
        />
      </div>
    );
  }

  // 4️⃣ Đã xác thực hợp lệ → cho phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;
