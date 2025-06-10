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

export const useUserDetailsQuery = (user_id: string) => {
  return useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => fetchUserDetails(user_id),
    retry: false,
  });
};
