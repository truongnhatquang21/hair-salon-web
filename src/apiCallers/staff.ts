"use server";

import type { CreateStaffSchemaTypeWithId } from "@/views/staffs/helper";

import { fetcher } from ".";

export const getListStaffAPI = async ({ branch }: { branch: string }) => {
  if (!branch) return [];
  return fetcher<CreateStaffSchemaTypeWithId[]>(
    `/staff/get-by-branch/${branch}`
  );
};

export const postCreateStaffAPI = async (
  data: CreateStaffSchemaTypeWithId & {
    branch: string;
    manager: string;
  }
) => {
  return fetcher<CreateStaffSchemaTypeWithId>("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
