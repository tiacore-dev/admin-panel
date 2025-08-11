// src/hooks/includeRoles/useIncludeRolesQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchRoleIncludeRelations,
  fetchRoleIncludeRelation,
  type IRoleIncludeRelationsResponse,
  type IRoleIncludeRelation,
} from "../../api/includeRolesApi";

export interface IRoleIncludeRelationsQueryParams {
  parent_role_id?: string;
  child_role_id?: string;
  page?: number;
  page_size?: number;
}

export const useRoleIncludeRelationsQuery = (
  params?: IRoleIncludeRelationsQueryParams
) => {
  return useQuery<IRoleIncludeRelationsResponse>({
    queryKey: ["roleIncludeRelations", params],
    queryFn: () => fetchRoleIncludeRelations(params),
  });
};

export const useRoleIncludeRelationQuery = (
  role_include_relation_id: string
) => {
  return useQuery<IRoleIncludeRelation>({
    queryKey: ["roleIncludeRelation", role_include_relation_id],
    queryFn: () => fetchRoleIncludeRelation(role_include_relation_id),
    enabled: !!role_include_relation_id,
  });
};
