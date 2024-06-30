"use server";

import { mockRequest } from "@/lib/mockRequest";
import type { BranchSchemaType } from "@/views/branches/helper";
import { sampleData } from "@/views/requestedBranches/helper";

import { fetcher } from "..";

export const getBranchListAPI = async (sampleData?: any) => {
  // return fetcher("package-court")
  return fetcher("branch");
};

export const postBranchListAPI = async (data: BranchSchemaType) => {
  return fetcher("branch", {
    body: JSON.stringify(data),
    method: "POST",
  });
};
export const putBranchListAPI = async (data: BranchSchemaType) => {
  // return fetcher("package-court", {
  //   body: JSON.stringify(data),
  //   method: "POST",
  // });

  return mockRequest(sampleData);
};

export const getBranchByIdAPI = async (slug: string) => {
  const rest = await fetcher(`branch/get-by-id/${slug}`, {
    method: "GET",
  });
  if (rest.data !== undefined) {
    // Fetch details for each court asynchronously
    const courts = await Promise.all(
      rest.data.courts.map(async (court) => {
        const courtResponse = await fetcher(`court/${court}`, {
          method: "GET",
        });
        return courtResponse.data; // assuming courtResponse.data is the court details
      })
    );
    const slots = await Promise.all(
      rest.data.slots.map(async (slot) => {
        const slotResponse = await fetcher(`slot/get-by-id/${slot}`, {
          method: "GET",
        });
        return slotResponse.data; // assuming courtResponse.data is the court details
      })
    );

    return {
      ...rest,
      courts,
      slots,
    };
  }

  return rest;
};
