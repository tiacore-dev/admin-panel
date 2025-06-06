//src\hooks\users\useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
import { fetchUsers, fetchUserDetails, IUser } from "../../api/usersApi";
import { useCompany } from "../../context/companyContext";

export interface useUserQueryResponse {
  total: number;
  users: IUser[];
}

export const useUserQueryAll = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<useUserQueryResponse>({
    queryKey: ["users", selectedCompanyId],
    queryFn: () => fetchUsers(selectedCompanyId),
  });
};

export const useUserDetailsQuery = (user_id: string) => {
  const { selectedCompanyId } = useCompany();

  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id, selectedCompanyId),
    retry: false,
  });
};
