import { useQuery } from "@tanstack/react-query";
import {
  fetchEntityCompanyRelations,
  IEntityCompanyRelationsResponse,
} from "../../api/entityCompanyRelationsApi";

export const useEntityCompanyQuery = (
  legal_entity_id?: string,
  company_id?: string,
  relation_type?: string
) => {
  return useQuery<IEntityCompanyRelationsResponse | null>({
    queryKey: [
      "entityCompanyRelations",
      legal_entity_id,
      company_id,
      relation_type,
    ],
    queryFn: async () => {
      return await fetchEntityCompanyRelations(
        legal_entity_id,
        company_id,
        relation_type
      );
    },
    // retry: false,
  });
};
