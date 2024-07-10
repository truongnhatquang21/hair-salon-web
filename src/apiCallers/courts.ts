"use server";

import type { CourtStatusEnum } from "@/types";
import type { CourtSchemaTypeWithId } from "@/views/courts/helper";

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
export const getCourtByBranchIdAPI = async (branchId: string) => {
  if (!branchId) return [];
  return fetcher<CourtSchemaTypeWithId>(`court/search`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
  });
};

export const updateCourtAPI = async (data: CourtSchemaTypeWithId) => {
  return fetcher(`court/${data._id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const postCourtAPI = async (data: CourtSchemaTypeWithId) => {
  return fetcher(`court`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const getCourtAvailable = async (data) => {
  return fetcher<CourtType[]>(`court/get-court-available`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
