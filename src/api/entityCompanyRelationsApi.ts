import { axiosInstance } from "../axiosConfig";
// import toast from "react-hot-toast";
// import { AxiosError } from "axios";

export interface IEntityCompanyRelationCreate {
  legal_entity_id: string; //Expand allstringuuid
  company_id: string; //Expand allstringuuid
  relation_type: "buyer" | "seller"; //Expand allstring
}

export interface IEntityCompanyRelation {
  entity_company_relation_id: string; //uuid
  legal_entity_id: string; //Expand allstringuuid
  company_id: string; //Expand allstringuuid
  relation_type: "buyer" | "seller"; //Expand allstring
}
export interface IEntityCompanyRelationsResponse {
  total: number;
  relations: IEntityCompanyRelation[];
}

export const createEntityCompanyRelation = async (newEntityCompanyRelation: {
  legal_entity_id: string;
  company_id: string;
  relation_type: string;
}): Promise<IEntityCompanyRelationCreate> => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(
    `${url}/api/entity-company-relations/add`,
    newEntityCompanyRelation,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchEntityCompanyRelations = async (
  legal_entity_id?: string,
  company_id?: string,
  relation_type?: string
) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  if (legal_entity_id) {
    params.legal_entity_id = legal_entity_id;
  }
  if (company_id) {
    params.company_id = company_id;
  }
  if (relation_type) {
    params.relation_type = relation_type;
  }
  const response = await axiosInstance.get<IEntityCompanyRelationsResponse>(
    `${url}/api/entity-company-relations/all`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
export const deleteEntityCompanyRelation = async (relation_id: string) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  await axiosInstance.delete(
    `${url}/api/entity-company-relations/${relation_id}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
