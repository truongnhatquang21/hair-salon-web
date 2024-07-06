"use server";

import type { CreateOperaterSchemaTypeWithId } from "@/views/operator/helper";

import { fetcher } from ".";

export const getOperatorListAPI = async () => {
  return fetcher<CreateOperaterSchemaTypeWithId>("user/get/Operator");
};

export const postOperatorAPI = async (data: CreateOperaterSchemaType) => {
  return fetcher<CreateOperaterSchemaTypeWithId>("operator", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
