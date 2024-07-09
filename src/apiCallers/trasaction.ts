"use server";

import type { TransactionTypeWithId } from "@/views/transactions/helper";

import { fetcher } from ".";

export const getMyTransaction = async () => {
  return fetcher<TransactionTypeWithId[]>("transaction/get-my-transactions");
};
