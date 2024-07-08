import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";

import { cancelBookingAPI } from "@/apiCallers/customerBooking";
import { addCardAPI, getCardListAPI } from "@/apiCallers/payment";
import SpinnerIcon from "@/components/SpinnerIcon";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import cardimg from "@/public/assets/images/cardbank.png";
import type IBookingReceipt from "@/types/BookingReceipt";
import type { CardSchemaType } from "@/views/bookings/ConfirmBooking";
import { cardSchema } from "@/views/Subscription/checkout/CheckoutSubcription";

import { Loading } from "../loading";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";

type Props = {
  defalutValues: IBookingReceipt;
  Trigger: React.ReactNode;
  invalidateKey?: string[];
};

const CancelBookingBtn = ({ defalutValues, Trigger, invalidateKey }: Props) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [paymentId, setPaymentId] = React.useState("");
  const { mutateAsync: triggerAddCard, isPending: isAddingCard } = useMutation({
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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      bookingId,
      payment,
    }: {
      bookingId: string;
      payment: string;
    }) =>
      cancelBookingAPI({
        bookingId,
        paymentId: payment,
      }),
    onSuccess: (data) => {
      console.log(data);

      if (!data.ok) {
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
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    try {
      await mutateAsync({
        bookingId: defalutValues._id,
        payment: paymentId,
      });
      setIsOpen(false);
      if (invalidateKey)
        queryClient.invalidateQueries({ queryKey: invalidateKey });
    } catch (e) {
      console.error(e);
    }
  };
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const onAddCardSubmit = async (value: CardSchemaType) => {
    if (new Date(value.expDate) < new Date()) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Expired date must be greater than today",
      });
    }
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

  const availableCard = useMemo(
    () => cardList?.data?.filter((card) => new Date(card.expDate) > new Date()),
    [cardList?.data]
  );
  useEffect(() => {
    if (!paymentId && availableCard?.length) {
      setPaymentId(availableCard[0]._id);
    }
  }, [paymentId, setPaymentId, availableCard]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="w-full">{Trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            booking. Your all schedule will be removed and your money will be
            refunded to this bank card below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
          <span className="flex items-center  justify-between border-b py-2 font-semibold">
            Select bank account
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1" variant="secondary">
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
                  <AutoForm formSchema={cardSchema} onSubmit={onAddCardSubmit}>
                    <AutoFormSubmit className="w-full">
                      <DialogFooter className="w-full">
                        <Button
                          className="w-full"
                          type="submit"
                          disabled={isPending}
                        >
                          {isAddingCard ? <SpinnerIcon /> : "Save"}
                        </Button>
                      </DialogFooter>
                    </AutoFormSubmit>
                  </AutoForm>
                </div>
              </DialogContent>
            </Dialog>
          </span>

          {
            <div className="flex max-h-[300px] w-full flex-col gap-2 overflow-auto p-2">
              {isCardListLoading ? (
                <div className="flex size-full justify-center p-2">
                  <Loading />
                </div>
              ) : availableCard?.length ? (
                <RadioGroup
                  onValueChange={(value) => {
                    setPaymentId(value);
                  }}
                  value={paymentId}
                >
                  {availableCard?.map((card) => (
                    <div
                      className={cn("flex items-center space-x-2")}
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
                            <span className="text-xl font-bold capitalize">
                              {card.accountBank}
                            </span>
                            <span className="text-base font-semibold capitalize">
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
          }
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="default"
            className="flex items-center justify-center"
            onClick={() => handleDelete()}
          >
            {isPending ? <SpinnerIcon /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBookingBtn;
