"use server";

import type { CourtStatusEnum } from "@/types";

import { fetcher } from ".";

export type CourtType = {
  _id: string;
  name: string;
  type: string;
  price: number;
  images: any[];
  description: string;
  status: CourtStatusEnum;
  branch: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export const getCourtListAPI = async () => {
  return fetcher<CourtType[]>("court/get-my-available-courts");
};
export const getCourtAvailable = async (data) => {
  return fetcher<CourtType[]>(`court/get-court-available`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
