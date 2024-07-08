"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { BanknoteIcon, Eye, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getSubscriptionByIdAPI } from "@/apiCallers/adminSubcription";
import {
  buySubscriptionAPI,
  type PurchasedOrderType,
} from "@/apiCallers/package";
import { addCardAPI, getCardListAPI } from "@/apiCallers/payment";
import {
  formatToVND,
  PricingCard,
} from "@/app/[locale]/(normalUser)/(auth)/subscriptions/page";
import { Loading } from "@/components/loading";
import SpinnerIcon from "@/components/SpinnerIcon";
import { subscriptionFormSchema } from "@/components/Subscription/SubcriptionForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import cardimg from "@/public/assets/images/cardbank.png";
import vnpay from "@/public/assets/images/vnpay.png";
import { PackageEnum } from "@/views/AdminSubscriptions/helper";

import PaymentSuccesss from "./PaymentSuccess";

export const cardSchema = z.object({
  accountNumber: z.string().min(16).max(16),
  accountName: z.string(),
  accountBank: z.string(),
  expDate: z.coerce.date(),
});

const orderSchema = z.object({
  totalCourt: z.number(),
  paymentId: z
    .string({
      required_error: "Please select a payment method",
    })
    .min(1, "Please select a payment method"),
  packageId: z.string(),
});
export type OrderSchemaType = z.infer<typeof orderSchema>;
export type CardSchemaType = z.infer<typeof cardSchema>;
type Props = {
  subsId: string;
};

const CheckoutSubcription = ({ subsId }: Props) => {
  const [payment, setPayment] = useState<"bank" | "tranfer">("bank");
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", subsId],
    queryFn: async () => getSubscriptionByIdAPI(subsId),
  });
  const searchParams = useSearchParams();

  const totalCourt = Number(searchParams.get("totalCourt"));

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
  const { mutateAsync: triggerAddCard, isPending } = useMutation({
    mutationFn: async (data: CardSchemaType) => {
      return addCardAPI(data);
    },
    onSuccess: (data) => {
      console.log(data);

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
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }
      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });

  const { data: cardList, isLoading: isCardListLoading } = useQuery({
    queryKey: ["cardList"],
    queryFn: async () => getCardListAPI(),
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const onAddCardSubmit = async (value: CardSchemaType) => {
    try {
      await triggerAddCard(value);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["cardList"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    trigger,
    setValue,
    getValues,

    formState: { isLoading: isOrderSubmitting, errors },
  } = useForm<OrderSchemaType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      totalCourt,
      paymentId: "",
      packageId: subsId,
    },
  });

  const {
    mutateAsync: triggerOrder,
    isPending: isTriggeringOrder,
    data: purchasedData,
  } = useMutation({
    mutationFn: async (data: OrderSchemaType) => {
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
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }
      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const onSubmitOrder = async () => {
    try {
      const isValid = await trigger();
      if (!isValid) {
        return toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            errors?.paymentId?.message || "Please select a payment method",
        });
      }

      await triggerOrder(getValues());
      setIsConfirmDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  return (
    <>
      <div className="size-full">
        {isLoading ||
        (totalCourt === 0 &&
          subscription?.data?.type === PackageEnum.Custom) ? (
          <div className="flex w-full justify-center p-2">
            <Loading />
          </div>
        ) : subscription?.data ? (
          <div className=" mx-auto my-10 flex w-[600px] flex-col items-center gap-5">
            <div className="text-xl font-semibold">Checkout confirmation</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-3xl text-destructive">*</span>
              You are about to checkout with the following subscription, please
              review and confirm all details before proceeding.
            </div>
            <div className="flex w-full flex-col gap-4 ">
              <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                <span className="border-b font-semibold ">
                  Subscription details
                </span>
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="col-span-1  p-5 ">
                    <PricingCard {...subscription.data} showBtn={false} />
                  </div>
                  {subscription.data?.type === PackageEnum.Custom && (
                    <div className="w-full border-t-2 p-2">
                      <AutoForm
                        values={{
                          totalCourt: Number(searchParams.get("totalCourt")),
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
                              placeholder: "Total court",
                            },
                          },
                          duration: {
                            inputProps: {
                              disabled: true,
                              placeholder: "Duration",
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
                  <h3 className="text-center text-3xl font-bold">
                    Total:{" "}
                    {formatToVND(
                      (subscription.data.priceEachCourt || 0) *
                        Number(
                          searchParams.get("totalCourt") *
                            subscription.data.duration || 0
                        )
                    )}
                  </h3>
                )}
                {subscription.data?.type === PackageEnum.Standard && (
                  <h3 className="text-center text-3xl font-bold">
                    Total: {formatToVND(subscription.data.totalPrice || 0)}
                  </h3>
                )}
              </div>
              <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                <span className="flex items-center  justify-between border-b py-2 font-semibold">
                  Payment method
                  {payment === "bank" && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="flex items-center gap-1"
                          variant="secondary"
                        >
                          <Plus />
                          Add new card
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex max-h-[50%] flex-col overflow-auto sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Add new card</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to add a new court
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative flex-1 gap-4 overflow-auto p-2">
                          <AutoForm
                            formSchema={cardSchema}
                            onSubmit={onAddCardSubmit}
                          >
                            <AutoFormSubmit className="w-full">
                              <DialogFooter className="w-full">
                                <Button
                                  className="w-full"
                                  type="submit"
                                  disabled={isPending}
                                >
                                  {isPending ? <SpinnerIcon /> : "Save"}
                                </Button>
                              </DialogFooter>
                            </AutoFormSubmit>
                          </AutoForm>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Select
                    value={payment}
                    onValueChange={(value) => {
                      setPayment(value as "bank" | "tranfer");
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment method</SelectLabel>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="tranfer" disabled>
                          Tranfer money
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </span>

                {payment === "bank" ? (
                  <div className="flex max-h-[600px] w-full flex-col gap-2 overflow-auto p-2">
                    {isCardListLoading ? (
                      <div className="flex size-full justify-center p-2">
                        <Loading />
                      </div>
                    ) : cardList?.data?.length ? (
                      <RadioGroup
                        onValueChange={(value) => {
                          setValue("paymentId", value);
                        }}
                      >
                        {cardList?.data.map((card) => (
                          <div
                            className="flex items-center space-x-2"
                            key={card._id}
                          >
                            <RadioGroupItem value={card._id} id={card._id} />
                            <Label
                              htmlFor={card._id}
                              className="flex w-full items-center gap-2"
                            >
                              <div className="flex w-full items-center gap-2  rounded-md border-2 p-2">
                                <Image
                                  src={cardimg}
                                  alt="img"
                                  className="size-20 rounded-md border object-contain p-1 shadow-md"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xl font-bold">
                                    {card.accountBank}
                                  </span>
                                  <span className="text-base font-semibold">
                                    {card.accountName}
                                  </span>
                                  <span className="text-sm">
                                    {card.accountNumber.slice(0, 4)} **** ****{" "}
                                  </span>
                                  <span className="text-sm">
                                    {format(new Date(card.expDate), "MM/yyyy")}
                                  </span>
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Eye className="ml-auto cursor-pointer" />
                                  </DialogTrigger>
                                  <DialogContent className="flex max-h-[50%] flex-col overflow-auto sm:max-w-xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        <span>{card.accountBank}</span>
                                        <span className="text-sm font-normal">
                                          / {card.accountNumber}
                                        </span>
                                        <span />
                                      </DialogTitle>
                                      <DialogDescription>
                                        View card details
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="relative flex-1 gap-4 overflow-auto p-2">
                                      <AutoForm
                                        formSchema={cardSchema}
                                        values={{
                                          accountNumber: card.accountNumber,
                                          accountName: card.accountName,
                                          accountBank: card.accountBank,
                                          expDate: card.expDate,
                                        }}
                                        fieldConfig={{
                                          accountNumber: {
                                            inputProps: {
                                              readOnly: true,
                                              placeholder: "--",
                                            },
                                          },
                                          accountName: {
                                            inputProps: {
                                              readOnly: true,
                                              placeholder: "--",
                                            },
                                          },
                                          accountBank: {
                                            inputProps: {
                                              readOnly: true,
                                              placeholder: "--",
                                            },
                                          },
                                          expDate: {
                                            inputProps: {
                                              readOnly: true,
                                              placeholder: "--",
                                            },
                                          },
                                        }}
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </Label>
                          </div>
                        ))}

                        {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label
                        htmlFor="option-one"
                        className="flex w-full items-center gap-2"
                      >
                        <div className="flex w-full items-center gap-2  rounded-md border-2 p-2">
                          <Image
                            src={cardimg}
                            alt="img"
                            className="size-20 rounded-md border object-contain p-1 shadow-md"
                          />
                          <div className="flex flex-col">
                            <span className="text-xl font-semibold">
                              VCB - Vietcombank
                            </span>
                            <span className="text-sm">Trương Nhật Quang</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Eye className="ml-auto cursor-pointer" />
                            </DialogTrigger>
                            <DialogContent className="flex max-h-[50%] flex-col overflow-auto sm:max-w-xl">
                              <DialogHeader>
                                <DialogTitle>Add new card</DialogTitle>
                                <DialogDescription>
                                  Fill out the form below to add a new court
                                </DialogDescription>
                              </DialogHeader>
                              <div className="relative flex-1 gap-4 overflow-auto p-2">
                                <AutoForm formSchema={cardSchema} />
                              </div>
                              <DialogFooter className="w-full">
                                <Button className="w-full" type="submit">
                                  Save changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Label>
                    </div> */}
                      </RadioGroup>
                    ) : (
                      <div className="flex w-full justify-center text-sm">
                        No card found
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-2">
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label
                          htmlFor="option-two"
                          className="flex w-full items-center gap-2"
                        >
                          <div className="flex w-full items-center gap-2  rounded-md border-2 p-2">
                            <Image
                              src={vnpay}
                              alt="img"
                              className="size-20 rounded-md border object-contain p-1 shadow-md"
                            />
                            <div className="flex flex-col">
                              <span className="text-xl font-semibold">
                                VNPay
                              </span>
                              <span className="text-sm">Bookminton</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label
                          htmlFor="option-one"
                          className="flex w-full items-center gap-2"
                        >
                          <div className="flex w-full items-center gap-2  rounded-md border-2 p-2">
                            <Image
                              src={vnpay}
                              alt="img"
                              className="size-20 rounded-md border object-contain p-1 shadow-md"
                            />
                            <div className="flex flex-col">
                              <span className="text-xl font-semibold">
                                VNpay
                              </span>
                              <span className="text-sm">Bookminton</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
              <AlertDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="flex w-full items-center gap-2"
                    type="button"
                  >
                    <BanknoteIcon />
                    Checkout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Please review your subscription details before proceeding
                      to checkout.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <Button
                      onClick={onSubmitOrder}
                      disabled={isOrderSubmitting}
                      className="flex w-20 justify-center"
                      type="submit"
                    >
                      {isTriggeringOrder ? <SpinnerIcon /> : "Confirm"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="flex size-full justify-center">
            Subscription not found
          </div>
        )}
      </div>
      {purchasedData && purchasedData.ok ? (
        <AlertDialog open>
          <AlertDialogContent className="m-0  p-0 backdrop:blur-sm">
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
