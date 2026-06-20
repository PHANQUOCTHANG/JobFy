/**
 * Helper chuẩn hóa lỗi từ Axios/Backend cho toàn bộ Auth flows.
 *
 * Backend trả về cấu trúc:
 * {
 *   status: "error",
 *   message: string,          ← Thông báo chính
 *   errorCode?: string,       ← Mã phân loại lỗi (ACCOUNT_LOCKED, EMAIL_TAKEN, ...)
 *   field?: string,           ← Tên trường DB bị lỗi (email, phone, ...)
 *   data?: Record<string, any>, ← Dữ liệu kèm theo (vd: email khi unverified)
 *   details?: string[],       ← Mảng lỗi Zod validation chi tiết
 * }
 */
export interface ParsedError {
  message: string;
  errorCode?: string;
  field?: string;
  data?: Record<string, any>;
  details?: string[];
  statusCode?: number;
  isNetworkError: boolean;
}

export function extractError(err: unknown): ParsedError {
  const e = err as any;

  // Lỗi mạng / CORS / Server không chạy
  if (!e?.response) {
    return {
      message:
        e?.message === "Network Error"
          ? "Không thể kết nối đến máy chủ. Kiểm tra lại kết nối mạng."
          : e?.message || "Đã xảy ra lỗi không xác định",
      isNetworkError: true,
    };
  }

  const serverData = e.response.data;
  return {
    message: serverData?.message || "Đã xảy ra lỗi",
    errorCode: serverData?.errorCode,
    field: serverData?.field,
    data: serverData?.data,
    details: serverData?.details,
    statusCode: e.response.status,
    isNetworkError: false,
  };
}

/**
 * Parse Zod-style `details` array từ backend (vd: "email: Email không hợp lệ")
 * thành Record<fieldName, message> để dùng với form.setError()
 */
export function parseValidationDetails(
  details: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const detail of details) {
    const colonIndex = detail.indexOf(":");
    if (colonIndex !== -1) {
      const field = detail.slice(0, colonIndex).trim();
      const message = detail.slice(colonIndex + 1).trim();
      result[field] = message;
    }
  }
  return result;
}
