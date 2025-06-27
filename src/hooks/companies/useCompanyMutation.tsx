import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from "../../api/companiesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Button } from "antd";
import { refreshToken } from "../../api/authApi";

export const useCompanyMutations = (
  company_id: string,
  company_name: string,
  description?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: async (data) => {
      try {
        const newToken = await refreshToken();
        if (newToken) {
          const permissions = JSON.parse(
            localStorage.getItem("permissions") || "{}"
          );
          const newAvailableCompanies = Object.keys(permissions);

          queryClient.invalidateQueries({ queryKey: ["companies"] });
          toast.success(
            <>
              Компания успешно добавлена{" "}
              <Button onClick={() => navigate(`/companies/${data.company_id}`)}>
                Подробнее
              </Button>
            </>
          );
        }
      } catch (error) {
        toast.error("Ошибка при обновлении токена");
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        toast.error("Компания с таким названием уже существует");
      } else {
        toast.error("Ошибка при добавлении компании");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      company_id ? updateCompany(company_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (company_id) {
        queryClient.invalidateQueries({
          queryKey: ["companyDetails", company_id],
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
    mutationFn: () =>
      company_id ? deleteCompany(company_id) : Promise.reject(),
    onSuccess: async () => {
      try {
        const newToken = await refreshToken();
        if (newToken) {
          const permissions = JSON.parse(
            localStorage.getItem("permissions") || "{}"
          );

          // Если удаленная компания была выбрана

          queryClient.invalidateQueries({ queryKey: ["companies"] });
          toast.success("Успешно удалено");
          // navigate(-1);
        }
      } catch (error) {
        toast.error("Ошибка при обновлении токена");
      }
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
