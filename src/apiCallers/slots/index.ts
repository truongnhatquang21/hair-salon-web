"use server";

import { fetcher } from "..";

export const getSlotByBranch = async (branchId: string) => {
  return fetcher(`slot/get-of-branch/${branchId}`);
};

export const getSlotsOfCourt = async (data: {
  date: Date | undefined;
  courtId: string | undefined;
}) => {
  return fetcher("schedule", { method: "POST", body: JSON.stringify(data) });
};
