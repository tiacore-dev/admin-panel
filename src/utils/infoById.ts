import { IUser } from "../api/usersApi"; // убедись, что путь верный

export const getEmailById = (
  userId: string,
  users?: IUser[]
): string | undefined => {
  return users?.find((user) => user.user_id === userId)?.full_name;
};

export const getEntityNameById = (
  id: string | undefined,
  entities: { legal_entity_id: string; legal_entity_name: string }[] | undefined
): string | undefined => {
  if (!id || !entities) return undefined;
  return entities.find((entity) => entity.legal_entity_id === id)
    ?.legal_entity_name;
};

export const getContractStatusById = (
  id: string | undefined,
  statuses: { contract_status_id: string; status_name: string }[] | undefined
): string | undefined => {
  if (!id || !statuses) return undefined;
  return statuses.find((status) => status.contract_status_id === id)
    ?.status_name;
};

export const getContractNameById = (
  id: string | undefined,
  contracts: { contract_id: string; contract_name: string }[] | undefined
): string | undefined => {
  if (!id || !contracts) return undefined;
  return contracts.find((contract) => contract.contract_id === id)
    ?.contract_name;
};

export const getBankNameById = (
  id: string | undefined,
  bankAccounts: { bank_account_id: string; bank_name: string }[] | undefined
): string | undefined => {
  if (!id || !bankAccounts) return undefined;
  return bankAccounts.find((bank) => bank.bank_account_id === id)?.bank_name;
};

export const getBankAccountNumberById = (
  id: string | undefined,
  bankAccounts:
    | { bank_account_id: string; account_number: string }[]
    | undefined
): string | undefined => {
  if (!id || !bankAccounts) return undefined;
  return bankAccounts.find((bank) => bank.bank_account_id === id)
    ?.account_number;
};

export const getCompanyNameById = (
  id: string | undefined,
  companies: { company_id: string; company_name: string }[] | undefined
): string | undefined => {
  if (!id || !companies) return undefined;
  return companies.find((company) => company.company_id === id)?.company_name;
};

export const getServiceNameById = (
  id: string | undefined,
  services: { service_id: string; service_name: string }[] | undefined
): string | undefined => {
  if (!id || !services) return undefined;
  return services.find((service) => service.service_id === id)?.service_name;
};
