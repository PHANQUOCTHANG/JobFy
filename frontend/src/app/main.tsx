import { createRoot } from "react-dom/client";
import { store } from "@/store/store";
import { injectStore } from "@/lib/axios"; // <--- Đổi hàm này
import "@/index.css";
import { AppWithRouter } from "@/app/provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Inject toàn bộ Store vào Axios (Cung cấp cả dispatch và getState)
injectStore(store);


createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "missing-client-id"}>
    <AppWithRouter />
  </GoogleOAuthProvider>
);
