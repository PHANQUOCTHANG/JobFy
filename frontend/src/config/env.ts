// src/config/env.ts

const NODE_ENV = (import.meta.env.MODE ||
  import.meta.env.NODE_ENV ||
  "production") as string;

export const env = {
  API_URL:
    (import.meta.env.VITE_API_URL as string) ||
    "https://api.canco.vn/api",
  APP_NAME: (import.meta.env.VITE_APP_NAME as string) || "JobFy",
  NODE_ENV,
  SOCKET_URL:
    (import.meta.env.VITE_SOCKET_URL as string) ||
    "https://api.canco.vn",
  CDN_DOMAIN:
    (import.meta.env.VITE_CDN_DOMAIN as string) || "https://cdn.canco.vn",
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
};

export const isDev = () => NODE_ENV === "development";
export const isProd = () => NODE_ENV === "production";

export const getApiBase = () => env.API_URL;
