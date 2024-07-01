"use server";

import type { CardSchemaType } from "@/views/Subscription/checkout/CheckoutSubcription";

import { fetcher } from ".";

export type CardSchemaTypeWithId = CardSchemaType & { _id: string };
export const addCardAPI = async (data: CardSchemaType) => {
  return fetcher("payment/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCardListAPI = async () => {
  return fetcher<CardSchemaTypeWithId[]>("payment/get-my-payments");
};
