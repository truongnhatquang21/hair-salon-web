"use server";

import type { SlotSchemaType } from "@/views/branches/create/slide/AvailableSlot";

import { fetcher } from ".";

export const deleteSlotApi = async (id: string) => {
  return fetcher(`slot/${id}`, {
    method: "DELETE",
  });
};

export const postSlotAPI = async (
  data: SlotSchemaType & {
    branchId: string;
  }
) => {
  return fetcher(`slot/create/${data.branchId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
