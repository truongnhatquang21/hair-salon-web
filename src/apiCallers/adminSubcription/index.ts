import { mockRequest } from "@/lib/mockRequest";
import {
  type PackageCourtSchemaType,
  sampleData,
} from "@/views/AdminSubscriptions/helper";

export const getSubscriptionListAPI = async (sampleData?: any) => {
  // return fetcher("package-court")
  return mockRequest(sampleData);
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
