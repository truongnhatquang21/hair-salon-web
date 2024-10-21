'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { getSubscriptionByIdAPI } from '@/apiCallers/adminSubcription';
import {
  buySubscriptionAPI,
  type PurchasedOrderType,
} from '@/apiCallers/package';
import { getPaymentSubscriptionInfor } from '@/apiCallers/paymentOS';
import { formatToVND } from '@/app/[locale]/(normalUser)/(auth)/subscriptions/helper';
import { PricingCard } from '@/app/[locale]/(normalUser)/(auth)/subscriptions/page';
import { Loading } from '@/components/loading';
import PayOs from '@/components/payment/PayOS';
import { subscriptionFormSchema } from '@/components/Subscription/SubcriptionForm';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import AutoForm from '@/components/ui/auto-form';
import { useToast } from '@/components/ui/use-toast';
import { PackageEnum } from '@/views/AdminSubscriptions/helper';

import PaymentSuccesss from './PaymentSuccess';

export const cardSchema = z.object({
  accountNumber: z.string().min(5).max(16),
  accountName: z.string(),
  accountBank: z.string(),
  expDate: z.coerce.date(),
});

const orderSchema = z.object({
  totalCourt: z.number(),
  paymentId: z
    .string({
      required_error: 'Please select a payment method',
    })
    .min(1, 'Please select a payment method'),
  packageId: z.string(),
});
export type OrderSchemaType = z.infer<typeof orderSchema>;
export type CardSchemaType = z.infer<typeof cardSchema>;
type Props = {
  subsId: string;
};

const CheckoutSubcription = ({ subsId }: Props) => {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', subsId],
    queryFn: async () => getSubscriptionByIdAPI(subsId),
  });
  const searchParams = useSearchParams();

  const totalCourt = Number(searchParams.get('totalCourt'));

  const router = useRouter();

  useEffect(() => {
    if (
      subscription?.data?.type === PackageEnum.Custom &&
      !totalCourt &&
      totalCourt <= 0
    ) {
      router.push(`/subscriptions/order/${subsId}`);
    }
  }, [totalCourt, subsId, subscription?.data?.type, router]);

  const { toast } = useToast();

  const { setValue, getValues } = useForm<OrderSchemaType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      totalCourt,
      paymentId: '',
      packageId: subsId,
    },
  });

  const {
    mutateAsync: triggerOrder,
    isPending: isTriggeringOrder,
    data: purchasedData,
  } = useMutation({
    mutationFn: async (
      data: OrderSchemaType & {
        orderCode: string;
      }
    ) => {
      return buySubscriptionAPI(data);
    },
    onSuccess: (data) => {
      if (!data.ok) {
        // if (data.error) {
        //   const errs = data.error as { [key: string]: { message: string } };
        //   Object.entries(errs).forEach(([key, value]) => {
        //     setError(key as keyof PackageCourtSchemaType, {
        //       type: "manual",
        //       message: value.message,
        //     });
        //   });
        // }
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: 'default',
          className: 'bg-green-600 text-white',
          title: 'Message from system',
          description: data.message,
        });
      }
      return toast({
        variant: 'default',
        title: 'Submitted successfully',
        description: 'You can do something else now',
      });
    },
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const onSubmitOrder = async () => {
    try {
      await triggerOrder({
        ...getValues(),
        orderCode: paymentInfor?.data?.orderCode || '000000',
      });
      setIsConfirmDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    }
  };

  const { data: paymentInfor, isLoading: isGettingPaymentInfor } = useQuery({
    queryKey: ['subscriptionPaymentInfor', subsId],
    queryFn: async () => {
      return getPaymentSubscriptionInfor({
        packageId: subsId,
        totalCourt,
        description: 'Payment for subscription',
      });
    },
  });

  const [triggerValue, setTriggerValue] = useState(false);

  useEffect(() => {
    if (triggerValue) {
      onSubmitOrder();
    }
  }, [triggerValue]);

  useEffect(() => {
    setTimeout(() => {
      onSubmitOrder();
    }, 1000);
  }, []);

  return (
    <>
      <div className='size-full'>
        {isLoading ||
        (totalCourt === 0 &&
          subscription?.data?.type === PackageEnum.Custom) ? (
          <div className='flex w-full justify-center p-2'>
            <Loading />
          </div>
        ) : subscription?.data ? (
          <div className=' mx-auto my-10 flex w-[600px] flex-col items-center gap-5'>
            <div className='text-xl font-semibold'>Checkout confirmation</div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-3xl text-destructive'>*</span>
              You are about to checkout with the following subscription, please
              review and confirm all details before proceeding.
            </div>
            <div className='flex w-full flex-col gap-4 '>
              <div className='flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2'>
                <span className='border-b font-semibold '>
                  Subscription details
                </span>
                <div className='flex w-full flex-col items-center gap-4'>
                  <div className='col-span-1  p-5 '>
                    <PricingCard {...subscription.data} showBtn={false} />
                  </div>
                  {subscription.data?.type === PackageEnum.Custom && (
                    <div className='w-full border-t-2 p-2'>
                      <AutoForm
                        values={{
                          totalCourt: Number(searchParams.get('totalCourt')),
                          duration: subscription.data.duration as number,
                        }}
                        // Pass the schema to the form
                        formSchema={subscriptionFormSchema}
                        // You can add additional config for each field
                        // to customize the UI
                        fieldConfig={{
                          totalCourt: {
                            inputProps: {
                              disabled: true,
                              placeholder: 'Total court',
                            },
                          },
                          duration: {
                            inputProps: {
                              disabled: true,
                              placeholder: 'Duration',
                            },
                          },
                        }}
                        // Optionally, define dependencies between fields
                      >
                        {/* 
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
                      </AutoForm>
                    </div>
                  )}
                </div>
                {subscription.data?.type === PackageEnum.Custom && (
                  <h3 className='text-center text-3xl font-bold'>
                    Total:{' '}
                    {formatToVND(
                      (subscription.data.priceEachCourt || 0) *
                        Number(
                          searchParams.get('totalCourt') *
                            subscription.data.duration || 0
                        )
                    )}
                  </h3>
                )}
                {subscription.data?.type === PackageEnum.Standard && (
                  <h3 className='text-center text-3xl font-bold'>
                    Total: {formatToVND(subscription.data.totalPrice || 0)}
                  </h3>
                )}
              </div>
              <div className='flex w-full flex-col items-center gap-2 rounded-md border-2 border-dashed p-2'>
                {isGettingPaymentInfor || isTriggeringOrder ? (
                  <Loading />
                ) : paymentInfor?.data ? (
                  <PayOs
                    url={paymentInfor?.data?.url}
                    orderCode={paymentInfor?.data?.orderCode}
                    successTriggerFn={() => {
                      setTriggerValue(true);
                    }}
                  />
                ) : (
                  "Can't get payment information"
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex size-full justify-center'>
            Subscription not found
          </div>
        )}
      </div>
      {purchasedData && purchasedData.ok ? (
        <AlertDialog open>
          <AlertDialogContent className='m-0  p-0 backdrop:blur-sm'>
            <PaymentSuccesss
              purchaseData={purchasedData.data as PurchasedOrderType}
            />
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  );
};

export default CheckoutSubcription;
