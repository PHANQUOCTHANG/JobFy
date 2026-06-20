import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authApi from "@/features/auth/api/authApi";

import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { ThemedLoader } from "@/components/ui/ThemedLoader";
import { login } from "@/features/auth";

const FacebookCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const accessToken = searchParams.get("token");
    toast.success("Welcome back!", {
      description: `Logged in successfully as ${accessToken}`,
    });
    if (accessToken) {
      authApi
        .getMe(accessToken)
        .then((res) => {
          const user = res.data;
          dispatch(
            login({
              accessToken,
              user: user as any,
            }),
          );
          toast.success(`Chào mừng ${user.fullName || user.email} trở lại!`);
          navigate("/");
        })
        .catch((err) => {
          const errorCode = err.response?.data?.errorCode;
          if (errorCode === "ACCOUNT_LOCKED") {
            navigate("/login?error=locked");
          } else {
            navigate("/login?error=auth_failed");
          }
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <ThemedLoader />;
};

export default FacebookCallbackPage;
