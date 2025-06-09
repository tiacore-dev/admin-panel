import { useQuery } from "@tanstack/react-query";
import { fetchRestrictions, IRestriction } from "../../api/restrictionsApi";

export interface IRestrictionsResponse {
  total: number;
  restrictions: IRestriction[];
}

export const useRestrictionsQuery = () => {
  return useQuery<IRestrictionsResponse>({
    queryKey: ["restrictions"],
    queryFn: fetchRestrictions,
  });
};
