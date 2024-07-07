"use server";

import {
  type PackageCourtSchemaType,
  type PackageCourtSchemaTypeWithId,
} from "@/views/AdminSubscriptions/helper";

import { fetcher } from "..";

export const getSubscriptionListAPI = async () => {
  return fetcher<PackageCourtSchemaTypeWithId[]>("package-court");
};

export const getSubscriptionByIdAPI = async (id: string) => {
  return fetcher<PackageCourtSchemaTypeWithId>(`package-court/${id}`);
};

export const postSubscriptionListAPI = async (data: PackageCourtSchemaType) => {
  return fetcher("package-court", {
    body: JSON.stringify(data),
    method: "POST",
  });
};
export const putSubscriptionListAPI = async (
  data: PackageCourtSchemaTypeWithId
) => {
  return fetcher(`package-court/${data._id}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });
};
export const deleteSubscriptionListAPI = async (id: string) => {
  console.log("deleteSubscriptionListAPI", id);

  return fetcher(`package-court/${id}`, {
    method: "DELETE",
  });
};

export const toggleSubscriptionStatusAPI = async (
  data: PackageCourtSchemaTypeWithId
) => {
  return fetcher(`package-court/${data._id}`, {
    body: JSON.stringify(data),
    method: "PUT",
  });
};
