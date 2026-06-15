// Khớp với backend response format: { status: "success" | "error", data: T }
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

// Khớp với backend error format từ globalErrorHandler
export interface ApiErrorResponse {
  response?: {
    data?: {
      status: "error";
      statusCode?: number;
      message: string;
      // Mã lỗi cụ thể để FE xử lý phân nhánh (VD: ACCOUNT_LOCKED, UNVERIFIED_ACCOUNT, EMAIL_TAKEN)
      errorCode?: string;
      // Tên field bị lỗi để FE focus/đỏ đúng ô input
      field?: string;
      // Data kèm theo (VD: { email } khi UNVERIFIED_ACCOUNT)
      data?: Record<string, any>;
      // Mảng lỗi validation chi tiết từ Zod (VD: ["email: Email không hợp lệ"])
      details?: string[];
    };
  };
}

export interface PagedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    page: number;
    pageSize?: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
