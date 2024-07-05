"use server";

import { fetcher } from "..";

export const getSlotByBranch = async (branchId: string) => {
  return fetcher(`slot/get-of-branch/${branchId}`);
};
