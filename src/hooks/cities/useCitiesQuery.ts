//companyUseQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchCities, fetchCityDetails, ICity } from "../../api/citiesApi";

export interface useCitiesQueryResponse {
  total: number;
  citys: ICity[];
}

export const useCitiesQuery = () => {
  return useQuery<useCitiesQueryResponse>({
    queryKey: ["cities"],
    queryFn: () => fetchCities(),
  });
};

export const useCityDetailsQuery = (city_id: string) => {
  return useQuery<ICity>({
    queryKey: ["cityDetails", city_id],
    queryFn: () => fetchCityDetails(city_id),
    retry: false,
  });
};
