"use server";

import { fetcher } from "..";

export const getSlotByBranch = async (branchId: string) => {
  return fetcher(`slot/get-of-branch/${branchId}`);
};

export const getSlotsOfCourt = async (data: {
  date: string | undefined;
  courtId: string | undefined;
}) => {
  return fetcher("slot/get-of-court-by-date", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
