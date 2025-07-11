import { axiosInstance } from "../axiosConfig";

export interface ICity {
  city_id: string; //uuid
  city_name: string;
  region: string;
  code: string;
  external_id: string;
  timezone: number;
}
// /api/cities/all
export const fetchCities = async () => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 100 };
  const response = await axiosInstance.get(`${url}/api/cities/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// /api/cities/{city_id}
export const fetchCityDetails = async (city_id: string) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(`${url}/api/cities/${city_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// /api/cities/add
export const createCity = async (newCity: {
  city_name: string;
  region: string;
  code: string;
  external_id: string;
  timezone: number;
}): Promise<ICity> => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(`${url}/api/cities/add`, newCity, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// /api/cities/{city_id}
export const updateCity = async (city_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/cities/${city_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
// /api/cities/{city_id}
export const deleteCity = async (city_id: string) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  await axiosInstance.delete(`${url}/api/cities/${city_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
