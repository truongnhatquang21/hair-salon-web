"use server";

import { fetcher } from "..";

export const getCourtByIdAPI = async (slug: string) => {
  return fetcher(`court/${slug}`);
};
