// src/api/authApi.ts
import axios from "axios";
import { axiosInstance } from "../axiosConfig";
import { IUser } from "./usersApi";
import { AuthResponse } from "../hooks/auth/useAuthMutations";

export const registrationUser = async (newUser: {
  email: string;
  password: string;
  full_name: string;
  position: string;
}): Promise<IUser> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const application_id = process.env.REACT_APP_ID;
  const requestData = {
    ...newUser,
    application_id: application_id,
  };
  const response = await axiosInstance.post(
    `${url}/api/register`,
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const inviteUser = async (data: {
  email: string;
  company_id: string;
  role_id: string;
  application_id?: string;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  // const app_id = process.env.REACT_APP_ID;
  // data.application_id = app_id;
  const accessToken = localStorage.getItem("access_token");

  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");
  if (!accessToken) throw new Error("Access token is missing");

  const response = await axiosInstance.post(`${url}/api/invite`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const refreshToken = async (): Promise<string | null> => {
  const r_token = localStorage.getItem("refresh_token");
  if (!r_token) {
    return null;
  }

  try {
    const url = process.env.REACT_APP_AUTH_API_URL;
    const response = await axios.post<{
      access_token: string;
      refresh_token: string;
      permissions?: Record<string, string[]>;
      is_superadmin?: boolean;
    }>(`${url}/api/auth/refresh`, { refresh_token: r_token });

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    if (response.data.permissions) {
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions)
      );
    }
    if (response.data.is_superadmin !== undefined) {
      localStorage.setItem(
        "is_superadmin",
        response.data.is_superadmin.toString()
      );
    }

    return response.data.access_token;
  } catch (error) {
    localStorage.clear();
    return null;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  const response = await axiosInstance.post(`${url}/api/auth/login`, data);
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  const response = await axiosInstance.get(
    `${url}/api/verify-email?token=${token}`
  );
  return response.data;
};

export const resendVerification = async (email: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  await axiosInstance.post(`${url}/api/resend-verification`, { email });
};

export const acceptInvite = async (token: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  const response = await axiosInstance.get(
    `${url}/api/accept-invite?token=${token}`
  );
  return response.data;
};

// src/api/authApi.ts
export const registerWithToken = async (data: {
  token: string;
  email: string;
  password: string;
  full_name: string;
  position: string;
}): Promise<AuthResponse> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  // Разделяем данные: токен идет в query, остальное в body
  const { token, ...bodyData } = data;

  const response = await axiosInstance.post(
    `${url}/api/register-with-token?token=${encodeURIComponent(token)}`,
    bodyData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// /api/auth/logout
// export const logoutApi = async () => {
export const logoutApi = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  if (!url) throw new Error("REACT_APP_AUTH_API_URL is not defined");

  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await axiosInstance.post(
      `${url}/api/auth/logout`,
      { user_id: userId }, // Явно передаем как JSON объект
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.clear();
    return response.data;
  } catch (error) {
    localStorage.clear(); // Все равно очищаем хранилище при ошибке
    throw error;
  }
};
