import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";
import { ThemedLoader } from "@/components/ui/ThemedLoader";

export const GuestRoute = () => {
  const { user, isAuthChecking } = useAppSelector((state) => state.auth);

  // Chờ Redux Persist rehydrate xong trước khi quyết định redirect
  if (isAuthChecking) {
    return <ThemedLoader />;
  }

  // Nếu đã đăng nhập -> Đá về dashboard tương ứng của Role
  if (user) {
    if (user.role === "employer") return <Navigate to="/employer" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập -> Cho phép hiển thị trang Login/Register
  return <Outlet />;
};
