import { useQuery } from "@tanstack/react-query";
// import { useCompany } from "../../context/companyContext";
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
    queryKey: [legal_entity_id, company_id, relation_type],
    queryFn: async () => {
      // if (!legal_entity_id || !company_id || !relation_type) {
      //   return null;
      // }
      return await fetchEntityCompanyRelations(
        legal_entity_id,
        company_id,
        relation_type
      );
    },
    retry: false,
    // enabled: !!legal_entity_id && !!company_id && !!relation_type,
  });
};
