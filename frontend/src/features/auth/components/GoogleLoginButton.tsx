import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useLogin } from "../hooks/useLogin";

interface GoogleLoginButtonProps {
  role: "employer" | "candidate";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ role }) => {
  const { onGoogleLoginSuccess } = useLogin();

  const handleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      onGoogleLoginSuccess(credentialResponse.credential, role);
    } else {
      toast.error("Không nhận được token từ Google");
    }
  };

  const handleError = () => {
    toast.error("Đăng nhập Google thất bại");
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
