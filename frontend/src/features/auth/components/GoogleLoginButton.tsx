import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useLogin } from "../hooks/useLogin";

interface GoogleLoginButtonProps {
  role: "employer" | "candidate";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ role }) => {
  const { onGoogleLoginSuccess } = useLogin();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Dùng access_token do flow implicit trả về
      if (tokenResponse.access_token) {
        onGoogleLoginSuccess(tokenResponse.access_token, role);
      } else {
        toast.error("Không nhận được token từ Google");
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại");
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-2.5 hover:bg-gray-50 transition-colors"
    >
      <img 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      <span className="text-sm font-medium text-gray-700">Google</span>
    </button>
  );
};

export default GoogleLoginButton;
