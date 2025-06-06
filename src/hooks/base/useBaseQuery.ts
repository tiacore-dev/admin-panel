import {
  ILegalEntityTypesResponse,
  // IUserRolesResponse,
} from "../../api/baseApi";
import {
  fetchEntityTypes,
  // fetchUserRoles,
} from "../../api/baseApi";
import { useQuery } from "@tanstack/react-query";

export const useEntityTypes = () => {
  return useQuery<ILegalEntityTypesResponse>({
    queryKey: ["entityTypes"],
    queryFn: fetchEntityTypes,
  });
};
