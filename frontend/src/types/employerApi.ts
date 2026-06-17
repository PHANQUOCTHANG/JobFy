import axiosInstance from "@/lib/axios"; // Giả định bạn đã có file config axios

export interface VerificationProgress {
  step1: { isCompleted: boolean; email: string }; // Xác thực email
  step2: { isCompleted: boolean };               // Hoàn thiện hồ sơ cơ bản
  step3: { isVerified: boolean; hasTaxCode: boolean }; // Xác thực pháp lý
}

export const employerApi = {
  // Lấy tiến trình xác thực
  getProgress: async (): Promise<VerificationProgress> => {
    const response = await axiosInstance.get("/employer/verification-progress");
    return response.data.data;
  },

  // Gửi lại mã OTP
  resendOtp: async () => {
    const response = await axiosInstance.post("/employer/resend-otp");
    return response.data;
  },

  // Xác thực OTP (Bước 1)
  verifyEmail: async (otp: string) => {
    // axios baseURL: /api/v1
    const response = await axiosInstance.post("/employer/verify-email", { otp });
    return response.data;
  },

  // Gửi hồ sơ pháp lý (Bước 3)
  submitLegal: async (data: { taxCode: string; businessLicenseUrl: string }) => {
    const response = await axiosInstance.post("/employer/submit-legal", data);
    return response.data;
  }
};
