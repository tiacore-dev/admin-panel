"use client";

import { useMemo } from "react";
import { useAppsQuery } from "./useBaseQuery";

// Хук для получения названия приложения по ID
export const useAppNameById = (application_id?: string) => {
  const { data: appsData } = useAppsQuery();

  return useMemo(() => {
    if (!application_id || !appsData?.applications) return null;

    const app = appsData.applications.find(
      (app) => app.application_id === application_id
    );
    return app?.application_name || null;
  }, [application_id, appsData?.applications]);
};

// Хук для получения объекта приложения по ID
export const useAppById = (application_id?: string) => {
  const { data: appsData } = useAppsQuery();

  return useMemo(() => {
    if (!application_id || !appsData?.applications) return null;

    return (
      appsData.applications.find(
        (app) => app.application_id === application_id
      ) || null
    );
  }, [application_id, appsData?.applications]);
};

// Хук для создания мапы ID -> название для быстрого доступа
export const useAppsMap = () => {
  const { data: appsData } = useAppsQuery();

  return useMemo(() => {
    if (!appsData?.applications) return new Map();

    return new Map(
      appsData.applications.map((app) => [
        app.application_id,
        app.application_name,
      ])
    );
  }, [appsData?.applications]);
};
