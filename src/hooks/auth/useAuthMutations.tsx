import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginUser,
  verifyEmail,
  resendVerification,
  acceptInvite,
  inviteUser,
  registerWithToken,
} from "../../api/authApi";

type FormData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  permissions: Record<string, string[]>;
  is_superadmin: boolean;
  user_id: string;
};

type ApiError = {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
};
type RegisterWithTokenData = {
  token: string;
  email: string;
  password: string;
  full_name: string;
  position: string;
};
export const useLoginMutation = () => {
  //   const navigate = useNavigate();

  return useMutation<AuthResponse, ApiError, FormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("is_superadmin", data.is_superadmin.toString());
      if (!data.is_superadmin) {
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        const companyIds = Object.keys(data.permissions);
        if (companyIds.length > 0) {
          localStorage.setItem("selectedCompanyId", companyIds[0]);
        }
      }
      localStorage.setItem("user_id", data.user_id);

      window.location.href = "/home";
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.error("Email не подтвержден", { id: "email-not-verified" });
      } else {
        const errorMessage =
          error.response?.data.message || "Ошибка при авторизации";
        toast.error(errorMessage, { id: "login-error" });
      }
    },
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      window.history.replaceState(null, "", window.location.pathname);
      toast.success(
        "Email успешно подтверждён! Теперь вы можете войти в систему.",
        { id: "email-verified" }
      );
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message || "Ошибка при подтверждении email";
      toast.error(errorMessage, { id: "email-verify-error" });
    },
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success("Письмо подтверждения отправлено повторно");
    },
    onError: () => {
      toast.error("Ошибка при отправке письма подтверждения");
    },
  });
};

export const useAcceptInviteMutation = () => {
  // Убрали параметр token здесь
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token: string) => acceptInvite(token), // Перенесли token сюда
    onSuccess: () => {
      toast.success("Приглашение успешно принято!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Ошибка при принятии приглашения"
      );
      navigate("/login");
    },
  });
};

export const useInviteMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      company_id: string;
      role_id: string;
    }) => inviteUser(data),
    onSuccess: () => {
      toast.success("Приглашение отправлено");
    },
    onError: () => {
      toast.error("Ошибка при отправке приглашения");
    },
  });
};

export const useRegisterWithTokenMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterWithTokenData) => registerWithToken(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("is_superadmin", data.is_superadmin.toString());
      if (!data.is_superadmin) {
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        const companyIds = Object.keys(data.permissions);
        if (companyIds.length > 0) {
          localStorage.setItem("selectedCompanyId", companyIds[0]);
        }
      }
      localStorage.setItem("user_id", data.user_id);

      toast.success("Регистрация завершена успешно!");
      navigate("/home");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message || "Ошибка при регистрации";
      toast.error(errorMessage, { id: "register-error" });
    },
  });
};
