import { Footer } from "@/layouts/client/components/Footer";
import { Header } from "@/layouts/client/components/Header";
import { FloatingActionBar } from "@/layouts/client/components/FloatingActionBar";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-background font-sans antialiased text-foreground",
        // Thêm transition mượt mà khi đổi theme
        "transition-colors duration-300",
      )}
    >
      <Header />

      <main className="flex-1 w-full relative z-0">
        <Outlet />
      </main>

      <Footer />

      <FloatingActionBar />

    </div>
  );
};

export default ClientLayout;
