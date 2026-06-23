/**
 * @file providers.tsx
 * @description Wrapper Component chứa toàn bộ các Global Providers của ứng dụng.
 * @architecture
 * - ReduxProvider: State Management.
 * - PersistGate: Chặn render UI cho đến khi State được khôi phục từ LocalStorage (F5 không mất nhạc).
 * - QueryClientProvider: Server State (TanStack Query).
 * - SocketProvider: Realtime Connection.
 * - ThemeProvider: Dark/Light mode.
 */

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Internal Modules ---
import { store, persistor } from "@/store/store";
import { queryClient } from "@/lib/queryClient";

// Components ---
import { ThemedLoader } from "@/components/ui/ThemedLoader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SocketProvider } from "@/app/provider/SocketProvider";
// Note: router-aware sheet callbacks moved into RootLayout

// 1. APP PROVIDERS (Global Context Wrappers)
// ── Tách ra component riêng để dùng được hooks (cần nằm trong ReduxProvider) ──
const InnerProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Moved router-aware providers (ContextSheetProvider) into RootLayout so
  // they live inside Router context. InnerProviders now only returns children.
  return <>{children}</>;
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    {/**
     * @component PersistGate
     * @ux Hiển thị EqualizerLoader trong lúc chờ Redux lấy dữ liệu từ LocalStorage.
     * Điều này ngăn chặn việc UI bị "nháy" (FOUC) hoặc hiển thị sai trạng thái login/player.
     */}
    <PersistGate
      loading={
        <ThemedLoader />
      }
      persistor={persistor}
    >
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          {/* Thay đổi mặc định về 'light' để lấy lại màu trắng */}
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <InnerProviders>{children}</InnerProviders>

            <Toaster
              closeButton
              position="top-center" // Hiển thị ở trên cùng giữa màn hình (rất mượt cho Mobile)
              expand={true} // Xếp chồng các thông báo lên nhau dạng thẻ
              offset={24} // Khoảng cách an toàn với cạnh màn hình
              toastOptions={{
                classNames: {
                  toast:
                    "group flex items-center gap-3 bg-background/95 backdrop-blur-2xl border border-border/50 text-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-[20px] p-4 font-sans w-full max-w-[400px]",
                  title: "text-[14px] font-bold tracking-tight text-slate-800 dark:text-slate-200",
                  description: "text-[13px] font-medium text-slate-600 dark:text-slate-400",
                  icon: "group-data-[type=error]:text-destructive group-data-[type=success]:text-emerald-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500 size-5",
                  closeButton: "!left-auto !right-2 !top-2 !transform-none text-slate-400 hover:text-slate-800 bg-transparent hover:bg-slate-100 border-none",
                },
              }}
            />
          </ThemeProvider>
        </SocketProvider>
      </QueryClientProvider>
    </PersistGate>
  </ReduxProvider>
);
