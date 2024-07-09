"use server";

import type { ICourt } from "@/interfaces/court.interface";
import type { ISlot } from "@/interfaces/slot.interface";
import { mockRequest } from "@/lib/mockRequest";
import type { BranchStatusEnum } from "@/types";
import type { BranchSchemaType } from "@/views/branches/helper";
import { sampleData } from "@/views/requestedBranches/helper";

import { fetcher } from "..";

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
  courts: ICourt[];
  slots: ISlot[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type BranchSchemaTypeWithId = BranchSchemaType & {
  _id: string;
};
export const getBranchListAPI = async () => {
  console.log("getBranchListAPI");

  return fetcher<
    BranchSchemaTypeWithId & {
      createdAt: string;
    }
  >("branch");
};
export const getPopularBranchListAPI = async () => {
  console.log("get-popular");

  return fetcher<
    BranchSchemaTypeWithId & {
      createdAt: string;
    }
  >("branch/get-popular");
};

export const postBranchListAPI = async (data: BranchSchemaType) => {
  console.log(data, "odaso");

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

export const getBranchByIdAPI2 = async (id: string) => {
  return fetcher<BranchType>(`branch/get-by-id/${id}`);
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

export const updateStatusBranchAPI = async (data: {
  branchId: string;
  status: BranchStatusEnum;
}) => {
  return fetcher("branch/update-status", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateInformationBranchAPI = async (
  data: BranchSchemaTypeWithId
) => {
  return fetcher(`branch/${data._id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getMyBranchListAPI = async () => {
  return fetcher<BranchSchemaTypeWithId & { createdAt: string }[]>(
    "branch/get-my-branchs"
  );
};

export const handleRequestBranchAPI = async (data: {
  approve: boolean;
  branchId: string;
}) => {
  return fetcher(`branch/handle-request`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
