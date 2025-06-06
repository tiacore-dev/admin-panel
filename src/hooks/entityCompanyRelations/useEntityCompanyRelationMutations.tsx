// src/hooks/useServiceMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntityCompanyRelation } from "../../api/entityCompanyRelationsApi";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Импортируем AxiosError для обработки ошибок
// import { Button } from "antd";

export const useEntityCompanyRelationsMutations = (
  entity_company_relation_id: string,
  legal_entity_id: string,
  company_id: string,
  relation_type: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createEntityCompanyRelation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["entity_company_relation"] });
      queryClient.invalidateQueries({ queryKey: ["legalEntitiesSellers"] });
      queryClient.invalidateQueries({ queryKey: ["legalEntitiesBuyers"] });
      toast.success(<div>Успешно добавлено </div>);
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении");
    },
  });
  //   const updateMutation = useMutation({
  //     mutationFn: (editedData: any) =>
  //       user_id ? updateUser(user_id, editedData) : Promise.reject(),
  //     onSuccess: () => {
  //       if (user_id) {
  //         queryClient.invalidateQueries({
  //           queryKey: ["userDetails", user_id],
  //         });
  //       }
  //       setIsEditing && setIsEditing(false);
  //       toast.success("Информация обновлена");
  //     },
  //     onError: () => {
  //       toast.error("Ошибка при обновлении данных");
  //     },
  //   });

  //   const deleteMutation = useMutation({
  //     mutationFn: () => (user_id ? deleteUser(user_id) : Promise.reject()),
  //     onSuccess: () => {
  //       toast.success("Успешно удалено");
  //       navigate(-1);
  //     },
  //     onError: () => {
  //       toast.error("Ошибка при удалении");
  //     },
  //   });

  return {
    createMutation,
    // , updateMutation, deleteMutation
  };
};
