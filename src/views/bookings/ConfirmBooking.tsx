/* eslint-disable no-underscore-dangle */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  postBooking,
  postBookingCompetition,
  postBookingFlexible,
} from '@/apiCallers/customerBooking';
import { getCardListAPI } from '@/apiCallers/payment';
import { getPaymentBookingInfor } from '@/apiCallers/paymentOS';
import { formatToVND } from '@/app/[locale]/(normalUser)/(auth)/subscriptions/helper';
import CustomTag from '@/components/CustomTag';
import { Icons } from '@/components/icons';
import { Loading } from '@/components/loading';
import PayOs from '@/components/payment/PayOS';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import type { IBooking } from '@/interfaces/booking.interface';
import type { ISchedule } from '@/interfaces/schedule.interface';
import { useBookingStore } from '@/stores/bookingStore';

import { getDayOfPermanent } from '../../apiCallers/schedule/index';
// type Props = {
//   branchId: String;
// };
const cardSchema = z.object({
  accountNumber: z
    .string()
    .min(16)
    .max(16)
    .refine((value) => {
      if (Number.isNaN(value)) {
        //  throw new Error("Account number must contain only 16 digits");
        return { error: 'Account number must contain only 16 digits' };
      }
      return Number(value);
    }),
  accountName: z.string().transform((str) => str.toUpperCase()),
  accountBank: z.string().transform((str) => str.toUpperCase()),
  expDate: z.coerce.date(),
});

const bookingTransactionSchema = z.object({
  amount: z.number(),
  payment: z
    .string({
      required_error: 'Please select a payment method',
    })
    .min(1, 'Please select a payment method')
    .default('1234567'),
  // packageId: z.string(),
});
export type OrderSchemaType = z.infer<typeof bookingTransactionSchema>;
export type CardSchemaType = z.infer<typeof cardSchema>;
const ConfirmBooking = () => {
  const [paymentType, setPaymentType] = useState('full');
  const [open, setOpen] = useState(false);

  const [payment, setPayment] = useState<'bank' | 'tranfer'>('bank');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();
  const { toast } = useToast();
  const { data: cardList, isLoading: isCardListLoading } = useQuery({
    queryKey: ['cardList'],
    queryFn: async () => getCardListAPI(),
  });
  const { mutateAsync: getDayOfPermanentMutate, data: dayOfPermanent } =
    useMutation({
      mutationFn: async (dataREQ: { startDate: string; endDate: string }) => {
        return getDayOfPermanent(dataREQ);
      },
      onSuccess: (data) => {
        if (data.ok && !data.ok) {
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
        // if (data.message) {
        //   return toast({
        //     variant: "default",
        //     className: "bg-green-600 text-white",
        //     title: "Message from system",
        //     description: data.message,
        //   });
        // }
        // return toast({
        //   variant: "default",
        //   title: "Submitted successfully",
        //   description: "You can do something else now",
        // });
      },
    });

  const { bookingData } = useBookingStore((state) => {
    return {
      bookingData: state.bookingData,
    };
  });

  console.log(bookingData);
  const { trigger, setValue, getValues } = useForm<OrderSchemaType>({
    resolver: zodResolver(bookingTransactionSchema),
    defaultValues: {
      amount: 0,
      payment: '',
      // packageId: subsId,
    },
  });
  const { mutateAsync: bookingMutation, isPending: bookingMutating } =
    useMutation({
      mutationFn: async (bookingReq: {
        booking: Omit<IBooking, 'status'>;
        schedule: Omit<ISchedule, 'status'>;
        transaction: { amount: number; payment: string };
      }) => postBooking(bookingReq),
      onSuccess: (data) => {
        if (!data.ok) {
          if (data.error) {
            console.log(data.error);
          }

          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: data.message || data.statusText,
          });
        }

        if (data.message) {
          setOpen(true);
        }
      },
    });
  const {
    mutateAsync: bookingCompetitionMutatue,
    isPending: bookingCompetitionMutating,
  } = useMutation({
    mutationFn: async (bookingReq: {
      courtArray: string[];
      booking: Omit<IBooking, 'status'>;
      schedule: Omit<ISchedule, 'status'>;
      transaction: { amount: number; payment: string };
    }) => postBookingCompetition(bookingReq),
    onSuccess: (data) => {
      if (!data.ok) {
        if (data.error) {
          console.log(data.error);
        }

        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: data.message || data.statusText,
        });
      }

      if (data.message) {
        setOpen(true);
      }
    },
  });
  const {
    mutateAsync: bookingMutationFlexible,
    isPending: bookingMutatingFlexible,
  } = useMutation({
    mutationFn: async (bookingReq: {
      booking: Omit<IBooking, 'status'>;
      transaction: { amount: number; payment: string };
    }) => postBookingFlexible(bookingReq),
    onSuccess: (data) => {
      if (!data.ok) {
        if (data.error) {
          console.log(data.error);
        }

        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: data.message || data.statusText,
        });
      }

      if (data.message) {
        setOpen(true);
      }
    },
  });

  const handleBooking = async () => {
    const paymentId = getValues('payment') || '123123' || '1211324';
    if (
      bookingData?.booking?.type === 'single_schedule' &&
      bookingData.schedule &&
      paymentId
    ) {
      console.log({
        booking: {
          type: bookingData?.booking.type,
          paymentType,
          payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: bookingData.booking.totalHour,
          startDate: bookingData.booking.startDate,
          endDate: bookingData.booking.endDate,
          court: bookingData.booking.court._id,
        },
        schedule: {
          type: bookingData.schedule.type,
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
          court: bookingData.schedule.court._id,
        },

        transaction: {
          amount: bookingData.booking.totalPrice,
          payment: getValues('payment') || '123123',
        },
      });

      await bookingMutation({
        booking: {
          type: bookingData.booking.type,
          paymentType,
          paymentMethod: payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: bookingData.booking.totalHour,
          startDate: bookingData.booking.startDate,
          endDate: bookingData.booking.endDate,
          court: bookingData.booking.court._id,
        },
        schedule: {
          type: bookingData.schedule.type,
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
          court: bookingData.schedule.court._id,
        },

        transaction: {
          amount:
            paymentType === 'full'
              ? bookingData.booking.totalPrice
              : bookingData.booking.totalPrice / 2,
          payment: getValues('payment') || '123123',
        },
      });
    } else if (
      bookingData?.booking?.type === 'permanent_schedule' &&
      bookingData.schedule &&
      paymentId
    ) {
      const endDate1month = new Date(bookingData.booking.endDate);
      endDate1month.setMonth(endDate1month.getMonth() + 1);

      console.log({
        booking: {
          type: bookingData.booking.type,
          paymentType,
          payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour:
            bookingData.booking.totalHour * dayOfPermanent?.data.length,
          startDate: bookingData.booking.startDate,
          endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
          court: bookingData.booking.court._id,
        },
        schedule: {
          type: bookingData.schedule.type,
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
          court: bookingData.schedule.court._id,
        },

        transaction: {
          amount: bookingData.booking.totalPrice,
          payment: getValues('payment') || '123123',
        },
      });

      await bookingMutation({
        booking: {
          type: bookingData.booking.type,
          paymentType,
          paymentMethod: payment,
          totalPrice:
            paymentType === 'full'
              ? bookingData.booking.totalPrice * dayOfPermanent?.data.length
              : (bookingData.booking.totalPrice * dayOfPermanent?.data.length) /
                2,
          totalHour:
            bookingData.booking.totalHour * dayOfPermanent?.data.length,
          startDate: bookingData.booking.startDate,
          endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
          court: bookingData.booking.court._id,
        },
        schedule: {
          type: bookingData.schedule.type,
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
          court: bookingData.schedule.court._id,
        },
        transaction: {
          amount:
            paymentType === 'full'
              ? bookingData.booking.totalPrice * dayOfPermanent?.data.length
              : (bookingData.booking.totalPrice * dayOfPermanent?.data.length) /
                2,
          payment: getValues('payment') || '123123',
        },
      });
    } else if (
      bookingData?.booking?.type === 'flexible_schedule' &&
      paymentId
    ) {
      const endDate1month = new Date(bookingData.booking.endDate);
      endDate1month.setMonth(endDate1month.getMonth() + 1);

      await bookingMutationFlexible({
        booking: {
          type: bookingData.booking.type,
          paymentType,
          paymentMethod: payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: parseInt(bookingData.booking.totalHour, 10),
          startDate: bookingData.booking.startDate,
          endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
          court: bookingData.booking.court._id,
        },
        transaction: {
          amount: bookingData.booking.totalPrice,
          payment: getValues('payment') || '123123',
        },
      });
    } else if (
      bookingData?.booking?.type === 'competition_schedule' &&
      paymentId
    ) {
      const endDate1month = new Date(bookingData.booking.endDate);
      endDate1month.setMonth(endDate1month.getMonth() + 1);
      console.log({
        courtArray: bookingData?.booking?.arrayCourt?.map((el) => el._id),
        booking: {
          paymentType,
          paymentMethod: payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: bookingData.booking.totalHour,
          startDate: bookingData.booking.startDate,
          endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
        },
        schedule: {
          type: 'booking',
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
        },

        transaction: {
          amount:
            paymentType === 'full'
              ? bookingData.booking.totalPrice
              : bookingData.booking.totalPrice / 2,
          payment: getValues('payment') || '123123',
        },
      });
      await bookingCompetitionMutatue({
        courtArray: bookingData?.booking?.arrayCourt?.map((el) => el._id),
        booking: {
          paymentType,
          paymentMethod: payment,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: bookingData.booking.totalHour,
          startDate: bookingData.booking.startDate,
          endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
        },
        schedule: {
          type: 'booking',
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
        },

        transaction: {
          amount:
            paymentType === 'full'
              ? bookingData.booking.totalPrice
              : bookingData.booking.totalPrice / 2,
          payment: getValues('payment') || '123123',
        },
      });
    }
  };

  const totalAmount = useMemo(() => {
    if (bookingData?.booking)
      if (
        bookingData.booking?.type === 'permanent_schedule' &&
        dayOfPermanent?.data
      ) {
        return paymentType === 'full'
          ? bookingData.booking.totalPrice * dayOfPermanent?.data?.length
          : (bookingData.booking.totalPrice * dayOfPermanent?.data?.length) / 2;
      }

    return paymentType === 'full'
      ? bookingData.booking.totalPrice
      : bookingData.booking.totalPrice / 2;
    return undefined;
  }, [paymentType, dayOfPermanent?.data]);

  console.log(bookingData);
  const getEndDate = () => {
    if (
      bookingData?.booking?.type !== 'single_schedule' &&
      bookingData.booking
    ) {
      const endDate1month = new Date(bookingData.booking.endDate);
      endDate1month.setMonth(endDate1month.getMonth() + 1);
      return format(endDate1month.toString(), 'yyyy-MM-dd');
    }

    return bookingData.booking?.endDate;
  };
  useEffect(() => {
    if (bookingData.booking?.type === 'permanent_schedule') {
      const endDate1month = new Date(bookingData.booking.endDate);
      endDate1month.setMonth(endDate1month.getMonth() + 1);

      getDayOfPermanentMutate({
        startDate: bookingData.booking?.startDate,
        endDate: format(endDate1month.toString(), 'yyyy-MM-dd'),
      });
    }
  }, [bookingData.booking, getDayOfPermanentMutate]);

  useEffect(() => {
    if (!bookingData.booking) {
      router.back();
    }
  }, [bookingData.booking, router]);

  const { data: PayOSInfor, isFetching: isGettingPayInfor } = useQuery({
    queryKey: ['bookingPayOSLink', totalAmount],
    queryFn: async () => {
      if (totalAmount) {
        return getPaymentBookingInfor({
          amount: totalAmount,
          description: 'Booking PickleBall Court',
          courtId:
            bookingData.booking.court._id ||
            bookingData.booking.arrayCourt[0]._id,
        });
      }
      return null;
    },
    enabled: !!totalAmount,
  });

  const [triggerValue, setTriggerValue] = useState(false);

  useEffect(() => {
    if (triggerValue) {
      handleBooking();
    }
  }, [triggerValue]);

  return (
    <div className='w-full space-y-8'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>Confirm Booking</h1>
        <p className='text-lg text-muted-foreground'>
          Review your pickleball court booking details.
        </p>
      </div>
      <div
        className={` w-full  gap-6   ${bookingData.booking?.type === 'permanent_schedule' ? 'grid grid-cols-3' : 'flex justify-center'}`}
      >
        {bookingData.booking?.type === 'permanent_schedule' && (
          <Card className='col-span-1  rounded-lg shadow-lg'>
            <CardHeader className='rounded-t-lg bg-primary px-6 py-4 text-primary-foreground'>
              <CardTitle className='text-center text-2xl font-semibold'>
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className='max-h-[88vh] overflow-y-auto p-0'>
              {dayOfPermanent?.data.map((el, id) => {
                return (
                  <Card className='grid w-full max-w-md gap-6 p-6' key={id}>
                    <div className='flex items-center justify-between'>
                      <div className='grid gap-1'>
                        <div className='text-2xl font-semibold'>
                          {' '}
                          {bookingData.booking?.court.name}
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-4'>
                      <div className='flex items-center justify-between'>
                        <div className='text-muted-foreground'>Date</div>
                        <div>{format(el, 'yyyy-MM-dd')}</div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='text-muted-foreground'>Start Time</div>
                        <div>{bookingData.schedule?.startTime}</div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='text-muted-foreground'>End Time</div>
                        <div>{bookingData.schedule?.endTime}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card
          className={`rounded-lg shadow-lg  ${bookingData.booking?.type === 'permanent_schedule' ? 'col-span-2' : 'w-1/2'}`}
        >
          <CardHeader className='rounded-t-lg bg-primary px-6 py-4 text-primary-foreground'>
            <CardTitle className='text-center text-2xl font-semibold'>
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-6 p-6'>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='start-date' className='text-lg font-medium'>
                  Start Date
                </Label>
                <div id='start-date' className='mt-2 text-sm font-medium'>
                  {bookingData.booking?.startDate}
                </div>
              </div>
              <div>
                <Label htmlFor='end-date' className='text-lg font-medium'>
                  End Date
                </Label>
                <div id='end-date' className='mt-2 text-sm font-medium'>
                  {getEndDate()}
                </div>
              </div>
            </div>

            {bookingData?.booking?.type !== 'flexible_schedule' && (
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <Label htmlFor='start-time' className='text-lg font-medium'>
                    Start Time
                  </Label>
                  <div id='start-time' className='mt-2 text-sm font-medium'>
                    {bookingData.schedule?.startTime}
                  </div>
                </div>
                <div>
                  <Label htmlFor='end-time' className='text-lg font-medium'>
                    End Time
                  </Label>
                  <div id='start-time' className='mt-2 text-sm font-medium'>
                    {bookingData.schedule?.endTime}
                  </div>
                </div>
              </div>
            )}

            <div>
              {bookingData?.booking?.type === 'competition_schedule' ? (
                <>
                  <Label htmlFor='court' className='text-lg font-medium'>
                    Courts
                  </Label>
                  <div className='max-h-50 overflow-auto'>
                    {bookingData?.booking?.arrayCourt?.map((court) => {
                      return (
                        <Card
                          key={court._id}
                          className={`
   
                 mb-4
              cursor-pointer hover:bg-muted`}
                        >
                          <CardContent className='grid gap-4 overflow-hidden p-5'>
                            <div className='flex items-center gap-4'>
                              <div
                                className={`cursor-pointer rounded-lg border-white object-cover 
                       p-2 text-white 
                    `}
                              >
                                <Icons.badmintonCourt className='rounded-lg object-cover' />
                              </div>
                              <div>
                                <h3 className='font-semibold'>{court.name}</h3>
                                {/* <span
                                  className={`line-clamp-3 text-sm
                       text-gray-500 dark:text-gray-400
                  `}
                                >
                                  {bookingData.booking?.court.description}
                                </span> */}
                              </div>
                            </div>
                            <div className='flex items-center justify-between'>
                              {bookingData.booking?.type !==
                                'competition_schedule' && (
                                <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                                  <CustomTag status={court.status} />
                                </div>
                              )}

                              <div
                                className={`flex items-center gap-2 text-sm 
                        text-gray-500 dark:text-gray-400
                    `}
                              >
                                <UsersIcon className='size-4' />
                                <span>type: {court.type}</span>
                              </div>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div
                                className={`flex items-center gap-2 text-sm 
                    text-gray-500 dark:text-gray-400
                    `}
                              >
                                {/* <DollarSignIcon className="size-4" /> */}
                                <span> {formatToVND(court.price)}</span>
                              </div>
                              {/* <Button variant="outline" size="sm">
                        Book Now
                      </Button> */}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <Label htmlFor='court' className='text-lg font-medium'>
                    Court
                  </Label>
                  <Card
                    key={bookingData.booking?.court._id}
                    className={`
   
                 cursor-pointer
              hover:bg-muted`}
                  >
                    <CardContent className='grid gap-4 overflow-hidden p-5'>
                      <div className='flex items-center gap-4'>
                        <div
                          className={`cursor-pointer rounded-lg border-white object-cover 
                       p-2 text-white 
                    `}
                        >
                          <Icons.badmintonCourt className='rounded-lg object-cover' />
                        </div>
                        <div>
                          <h3 className='font-semibold'>
                            {bookingData.booking?.court.name}
                          </h3>
                          <span
                            className={`line-clamp-3 text-sm
                       text-gray-500 dark:text-gray-400
                  `}
                          >
                            {bookingData.booking?.court.description}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        {bookingData.booking?.type !==
                          'competition_schedule' && (
                          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                            <CustomTag
                              status={bookingData.booking?.court.status}
                            />
                          </div>
                        )}

                        <div
                          className={`flex items-center gap-2 text-sm 
                        text-gray-500 dark:text-gray-400
                    `}
                        >
                          <UsersIcon className='size-4' />
                          <span>type: {bookingData.booking?.court.type}</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div
                          className={`flex items-center gap-2 text-sm 
                    text-gray-500 dark:text-gray-400
                    `}
                        >
                          {/* <DollarSignIcon className="size-4" /> */}
                          <span>
                            {' '}
                            {formatToVND(bookingData.booking?.court.price)}
                          </span>
                        </div>
                        {/* <Button variant="outline" size="sm">
                        Book Now
                      </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='total-price' className='text-lg font-medium'>
                  Total Price
                </Label>
                <div id='total-price' className='mt-2 text-2xl font-bold'>
                  {bookingData.booking?.type === 'permanent_schedule'
                    ? formatToVND(
                        bookingData?.booking?.totalPrice *
                          dayOfPermanent?.data?.length
                      )
                    : formatToVND(bookingData?.booking?.totalPrice)}
                </div>
              </div>
              <div>
                <Label htmlFor='total-hours' className='text-lg font-medium'>
                  Total Hours
                </Label>
                <div id='total-hours' className='mt-2 text-2xl font-bold'>
                  {bookingData.booking?.type === 'permanent_schedule'
                    ? bookingData?.booking?.totalHour *
                      dayOfPermanent?.data?.length
                    : bookingData?.booking?.totalHour}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div className=''>
                <Label htmlFor='total-price' className='text-lg font-medium'>
                  Amount
                </Label>
                <div id='total-price' className='mt-2 text-2xl font-bold'>
                  {paymentType === 'full'
                    ? bookingData.booking?.type === 'permanent_schedule'
                      ? formatToVND(
                          bookingData?.booking?.totalPrice *
                            dayOfPermanent?.data?.length
                        )
                      : formatToVND(bookingData?.booking?.totalPrice)
                    : bookingData.booking?.type === 'permanent_schedule'
                      ? formatToVND(
                          (bookingData?.booking?.totalPrice *
                            dayOfPermanent?.data?.length) /
                            2
                        )
                      : formatToVND(bookingData?.booking?.totalPrice / 2)}
                </div>
              </div>
              <div className=''>
                <Label htmlFor='total-hours' className='text-lg font-medium'>
                  Payment Type
                </Label>
                <Select
                  value={paymentType}
                  onValueChange={(value) => {
                    setPaymentType(value as 'partial' | 'full');
                  }}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select a payment Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Payment Type</SelectLabel>
                      <SelectItem
                        value='partial'
                        disabled={
                          bookingData?.booking?.type === 'flexible_schedule'
                        }
                      >
                        Partial
                      </SelectItem>
                      <SelectItem value='full'>Full</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex w-full flex-col items-center gap-2 rounded-md border-2 border-dashed p-2'>
              {isGettingPayInfor ||
              bookingCompetitionMutating ||
              bookingMutating ||
              bookingMutatingFlexible ? (
                <Loading />
              ) : PayOSInfor?.data ? (
                <PayOs
                  url={PayOSInfor?.data?.url}
                  orderCode={PayOSInfor?.data?.orderCode}
                  successTriggerFn={() => {
                    setTriggerValue(true);
                  }}
                />
              ) : (
                "Can't get payment information"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Please check your mail.
              <br /> You can go to the schedule to view more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                router.push('/me/schedule');
              }}
            >
              Go To Schedule
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                router.push('/');
              }}
            >
              Go Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfirmBooking;
