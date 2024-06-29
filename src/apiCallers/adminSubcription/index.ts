"use server";

import {
  type PackageCourtSchemaType,
  type PackageCourtSchemaTypeWithId,
} from "@/views/AdminSubscriptions/helper";

import { fetcher } from "..";

export const getSubscriptionListAPI = async () => {
  return fetcher("package-court");
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
  console.log(data);

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
