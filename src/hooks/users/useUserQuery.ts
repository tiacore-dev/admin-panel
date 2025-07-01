//src\hooks\users\useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
import { fetchUsers, fetchUserDetails, IUser } from "../../api/usersApi";

export interface useUserQueryResponse {
  total: number;
  users: IUser[];
}

export const useUserQueryAll = () => {
  return useQuery<useUserQueryResponse>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
};

export const useUserDetailsQuery = (
  user_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id),
    retry: false,
    ...options, // Распространяем переданные options
  });
};
// export const useCompanyDetailsQuery = (
//   company_id: string,
//   options?: { enabled?: boolean }
// ) => {
//   return useQuery<ICompany>({
//     queryKey: ["companyDetails", company_id],
//     queryFn: () => fetchCompanyDetails(company_id),
//     retry: false,
//     ...options, // Распространяем переданные options
//   });
// };
