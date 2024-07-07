"use server";

import type { CreateCustomerSchemaTypeWithId } from "@/views/customer/helper";

import { fetcher } from ".";

export const getCustomerListAPI = async () => {
  return fetcher<CreateCustomerSchemaTypeWithId>("user/get/Customer");
};

export const banUSerAPI = async (data: string) => {
  return fetcher("user/deactive", {
    method: "POST",
    body: JSON.stringify({ id: data }),
  });
};

export const updateProfileAPI = async (
  data: CreateCustomerSchemaTypeWithId
) => {
  return fetcher(`user/update/${data._id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
