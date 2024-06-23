import { mockRequest } from "@/lib/mockRequest";
import {
  type PackageCourtSchemaType,
  sampleData,
} from "@/views/AdminSubscriptions/helper";

import { fetcher } from "..";

export const getSubscriptionListAPI = async (managerId: string) => {
  return fetcher(`package-purchase/get-purchases/${managerId}`);
};

export const postSubscriptionListAPI = async (data: PackageCourtSchemaType) => {
  // return fetcher("package-court", {
  //   body: JSON.stringify(data),
  //   method: "POST",
  // });

  return mockRequest(sampleData);
};
export const putSubscriptionListAPI = async (data: PackageCourtSchemaType) => {
  // return fetcher("package-court", {
  //   body: JSON.stringify(data),
  //   method: "POST",
  // });

  return mockRequest(sampleData);
};
