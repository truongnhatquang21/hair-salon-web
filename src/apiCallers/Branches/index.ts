"use server";

import { mockRequest } from "@/lib/mockRequest";
import type { BranchStatusEnum } from "@/types";
import type { BranchSchemaType } from "@/views/branches/helper";
import { sampleData } from "@/views/requestedBranches/helper";

import { fetcher } from "..";

export const getBranchListAPI = async (sampleData?: any) => {
  // return fetcher("package-court")
  return fetcher("branch");
export type BranchType = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  images: string[];
  licenses: string[];
  description: string;
  availableTime: string;
  status: BranchStatusEnum;
  manager: string;
  courts: string[];
  slots: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type BranchSchemaTypeWithId = BranchSchemaType & { _id: string };
export const getBranchListAPI = async () => {
  return fetcher<BranchSchemaTypeWithId>("branch");
};

export const postBranchListAPI = async (data: BranchSchemaType) => {
  return fetcher("branch", {
    body: JSON.stringify(data),
    method: "POST",
  });
};
export const searchBranchesAPI = async (searchParams: { keyword: string }) => {
  return fetcher("branch/search", {
    method: "POST",
    body: JSON.stringify(searchParams),
  });
};
export const getBranchByIdAPI = async (id: string) => {
  return fetcher<BranchSchemaTypeWithId>(`branch/get-by-id/${id}`);
};
export const putBranchListAPI = async (data: BranchSchemaType) => {
  // return fetcher("package-court", {
  //   body: JSON.stringify(data),
  //   method: "POST",
  // });

  return mockRequest(sampleData);
};

// export const getBranchByIdAPI = async (slug: string) => {
//   const rest = await fetcher(`branch/get-by-id/${slug}`, {
//     method: "GET",
//   });

//   return rest;
// };

export const getMyBranchListAPI = async () => {
  return fetcher<BranchSchemaType>("branch/get-my-branchs");
};

export const handleRequestBranchAPI = async (data: {
  approve: boolean;
  branchId: string;
}) => {
  return fetcher(`branch/handle-request`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
