// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useInitAuth } from "@/features/auth";
import { ThemedLoader } from "@/components/ui/ThemedLoader";
import { useAppSelector } from "@/store/hooks";

const RootLayout = () => {
  useInitAuth();

  // 2. Lấy trạng thái kiểm tra từ Store
  const { isAuthChecking } = useAppSelector((state) => state.auth);

  // 3. Splash Screen: Chặn render Outlet cho đến khi xác định được danh tính (User hoặc Guest)
  if (isAuthChecking) {
      <ThemedLoader />
  }

  return (
    <div className="relative min-h-screen">
      <main className="">
        {/* Thêm padding bottom để không bị Player đè mất nội dung cuối trang */}
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
