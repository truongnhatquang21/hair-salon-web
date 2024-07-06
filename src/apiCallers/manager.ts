"use server";

import type { CreateManagerSchemaTypeWithId } from "@/views/manger/helper";

import { fetcher } from ".";

export const getManagerListAPI = async () => {
  return fetcher<CreateManagerSchemaTypeWithId[]>("/manager");
};
