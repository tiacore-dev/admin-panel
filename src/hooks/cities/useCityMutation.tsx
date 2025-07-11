// src/hooks/useServiceMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios"; // Импортируем AxiosError для обработки ошибок
import { createCity, deleteCity, updateCity } from "../../api/citiesApi";
import { useNavigate } from "react-router-dom";

export const useCityMutations = (
  city_id?: string, //uuid
  city_name?: string,
  region?: string,
  code?: string,
  external_id?: string,
  timezone?: number,

  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createMutation = useMutation({
    mutationFn: createCity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      toast.success(<div>Город успешно добавлен</div>);
    },
    onError: (error: AxiosError) => {
      // Проверяем код ошибки
      if (error.response?.status === 400) {
        toast.error("Город с таким названием уже существует");
      } else {
        toast.error("Ошибка при добавлении Города");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      city_id ? updateCity(city_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (city_id) {
        queryClient.invalidateQueries({
          queryKey: ["cityDetails", city_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["cities"],
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
    mutationFn: () => (city_id ? deleteCity(city_id) : Promise.reject()),
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
  };
};
