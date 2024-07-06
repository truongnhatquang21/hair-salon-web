"use server";

import { fetcher } from "..";

export const getCourtByIdAPI = async (slug: string) => {
  return fetcher(`court/${slug}`);
};

export const searchCourtApi = async (key: string) => {
  return fetcher(`court/search`, {
    method: "POST",
    body: JSON.stringify(key),
  });
};
