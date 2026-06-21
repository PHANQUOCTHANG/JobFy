import axiosInstance from "@/lib/axios";

export interface VerificationProgress {
  step1: { isCompleted: boolean; email: string }; 
  step1_5: { isCompleted: boolean; phone: string | null };
  step2: { isCompleted: boolean };               
  step3: { isVerified: boolean; hasTaxCode: boolean }; 
}

export const employerApi = {
  getProgress: async (): Promise<VerificationProgress> => {
    const response = await axiosInstance.get("/employer/verification-progress");
    return response.data.data;
  },

  resendOtp: async () => {
    const response = await axiosInstance.post("/employer/resend-otp");
    return response.data;
  },

  verifyEmail: async (otp: string) => {
    const response = await axiosInstance.post("/employer/verify-email", { otp });
    return response.data;
  },

  submitLegal: async (data: { taxCode: string; businessLicenseUrl: string }) => {
    const response = await axiosInstance.post("/employer/submit-legal", data);
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("document", file);
    const response = await axiosInstance.post("/employer/upload-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  verifyPhone: async (firebaseIdToken: string) => {
    const response = await axiosInstance.post("/employer/verify-phone", { firebaseIdToken });
    return response.data;
  }
};
