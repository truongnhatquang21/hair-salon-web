'use server';

import { fetcher } from '..';

type PaymentSubscriptionParams = {
  packageId: string;
  totalCourt: number;
  description: string;
};
type PaymentInforResType = {
  orderCode: string;
  url: string;
};

export const getPaymentSubscriptionInfor = async (
  params: PaymentSubscriptionParams
) => {
  return fetcher<PaymentInforResType>(`payment/create-payment-url`, {
    body: JSON.stringify(params),
    method: 'POST',
  });
};

type PaymentBookingParams = {
  amount: number;
  description: string;
  courtId: string;
};
export const getPaymentBookingInfor = async (params: PaymentBookingParams) => {
  console.log('getPaymentBookingInfor');

  return fetcher<PaymentInforResType>(
    `payment/create-payment-url-for-booking`,
    {
      body: JSON.stringify(params),
      method: 'POST',
    }
  );
};
