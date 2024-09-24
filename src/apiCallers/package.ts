'use server';

import type { OrderSchemaType } from '@/views/Subscription/checkout/CheckoutSubcription';

import { fetcher } from '.';

export type PurchasedOrderType = {
  totalPrice: number;
  totalCourt: number;
  duration: number;
  priceEachCourt: number;
  startDate: string;
  endDate: string;
  status: string;
  manager: string;
  packageCourt: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export const buySubscriptionAPI = async (
  data: OrderSchemaType & { orderCode: string }
) => {
  return fetcher<PurchasedOrderType>('package-purchase/buy-package-full', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyPurchaseAPI = async () => {
  return fetcher<PurchasedOrderType>('package-purchase/get-my-purchases');
};
