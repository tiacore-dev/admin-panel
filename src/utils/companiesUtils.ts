// src/utils/companiesUtils.ts
export const createCompaniesMap = (
  companies: Array<{ company_id: string; company_name: string }>
): Map<string, string> => {
  const map = new Map<string, string>();
  companies.forEach((company) => {
    map.set(company.company_id, company.company_name);
  });
  return map;
};
