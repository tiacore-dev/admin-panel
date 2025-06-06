// src/hooks/useServiceMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "../../api/usersApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Импортируем AxiosError для обработки ошибок
import { Button } from "antd";
import { registrationUser } from "../../api/authApi";

export const useUserMutations = (
  user_id?: string,
  email?: string,
  password?: string,
  full_name?: string,
  position?: string,
  company_id?: string,

  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        <div>
          Пользователь успешно добавлен{" "}
          <Button
            type="link"
            onClick={() => navigate(`/users/${data.user_id}`)}
          >
            Подробнее
          </Button>
        </div>
      );
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      if (error.response?.status === 400) {
        toast.error("Пользователь с таким email уже существует");
      } else {
        toast.error("Ошибка при добавлении пользователя");
      }
    },
  });

  const registrationMutation = useMutation({
    mutationFn: registrationUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        <div>
          <div>Регистрация прошла успешно! </div>
          <div>Для завершения регистрации необходимо подтвердить email.</div>
        </div>,
        {
          duration: 8000,
        }
      );
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      if (error.response?.status === 400) {
        toast.error("Пользователь с таким email уже существует");
      } else {
        toast.error("Ошибка при добавлении пользователя");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      user_id ? updateUser(user_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (user_id) {
        queryClient.invalidateQueries({
          queryKey: ["userDetails", user_id],
        });
      }
      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => (user_id ? deleteUser(user_id) : Promise.reject()),
    onSuccess: () => {
      toast.success("Успешно удалено");
      navigate(-1);
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    registrationMutation,
  };
};
