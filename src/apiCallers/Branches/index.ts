"use server";

import { mockRequest } from "@/lib/mockRequest";
import type { BranchSchemaType } from "@/views/branches/helper";
import { sampleData } from "@/views/requestedBranches/helper";

import { fetcher } from "..";

export const getBranchListAPI = async () => {
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
