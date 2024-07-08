"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, KeyRound, Plus, Rocket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { z } from "zod";

import { getProfileAPI } from "@/apiCallers/auth";
import { getCourtListAPI } from "@/apiCallers/courts";
import { changePasswordApi } from "@/apiCallers/login";
import { addCardAPI, getCardListAPI } from "@/apiCallers/payment";
import { AccountAutoForm } from "@/components/Account/AccountForm";
import { Loading } from "@/components/loading";
import SpinnerIcon from "@/components/SpinnerIcon";
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
import { useToast } from "@/components/ui/use-toast";
import cardimg from "@/public/assets/images/cardbank.png";
import { RoleEnum } from "@/types";
import { signOutServer } from "@/utils/serverActions";

import {
  cardSchema,
  type CardSchemaType,
} from "../Subscription/checkout/CheckoutSubcription";

type Props = {};

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password must match new password",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

const Account = (props: Props) => {
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });
  const router = useRouter();
  const { toast } = useToast();
  const {
    mutateAsync: triggerChangePassword,
    isPending: isPendingChangePassword,
  } = useMutation({
    mutationFn: async (data: ChangePasswordSchemaType) => {
      return changePasswordApi(data);
    },
    onSuccess: (data) => {
      console.log(data);

      if ((data.ok && !data.ok) || data.status === 400) {
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
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const { data: courtsData } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => getCourtListAPI(),
  });

  const availableCourts = useMemo(() => {
    if (!profileData?.data?.maxCourt) {
      return 0;
    }
    if (profileData.data.maxCourt) {
      return (
        profileData.data.maxCourt - (courtsData?.data?.length as number) || 0
      );
    }
    return 0;
  }, [profileData?.data?.maxCourt, courtsData?.data?.length]);
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

  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const onChangePasswordSubmit = async (value: ChangePasswordSchemaType) => {
    try {
      await triggerChangePassword(value);
      setIsChangePasswordDialogOpen(false);
      await signOutServer();

      await queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
      await router.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  const onAddCardSubmit = async (value: CardSchemaType) => {
    if (new Date(value.expDate) < new Date()) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Your card has expired",
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

  return (
    <div className="relative flex h-full  flex-col gap-4 ">
      <h1 className="text-2xl font-semibold">Setting account</h1>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="relative w-full  flex-1 md:w-1/2 ">
          <AccountAutoForm defaultValue={profileData?.data} />
        </div>

        <div className="flex h-fit max-h-full w-full flex-col gap-2 overflow-auto rounded-md border-2 border-dashed p-2 md:w-1/2 ">
          <div className="mb-2 flex items-center justify-between  rounded-md border-b-2 bg-red-500 p-2 font-bold text-white shadow-sm">
            Change password ?
            <Dialog
              open={isChangePasswordDialogOpen}
              onOpenChange={setIsChangePasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                  <KeyRound />
                  Change here
                </Button>
              </DialogTrigger>
              <DialogContent className="flex max-h-[50%] flex-col overflow-auto sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Change password</DialogTitle>
                  <DialogDescription className=" w-full  font-semibold ">
                    <div className="w-full rounded-sm bg-red-500 p-2 text-white">
                      <span className="text-lg font-semibold">Warning:</span>
                      <span className="text-sm font-normal">
                        Fill out the form below to change your password, make
                        sure to remember it. After changing the password, you
                        will be logged out and need to log in again.
                      </span>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="relative flex-1 gap-4 overflow-auto p-2">
                  <AutoForm
                    formSchema={changePasswordSchema}
                    onSubmit={onChangePasswordSubmit}
                    fieldConfig={{
                      oldPassword: {
                        inputProps: {
                          type: "password",
                        },
                      },
                      newPassword: {
                        inputProps: {
                          type: "password",
                        },
                      },
                      confirmPassword: {
                        inputProps: {
                          type: "password",
                        },
                      },
                    }}
                  >
                    <AutoFormSubmit className="w-full">
                      <DialogFooter className="w-full">
                        <Button
                          className="w-full"
                          type="submit"
                          disabled={isPendingChangePassword}
                        >
                          {isPendingChangePassword ? <SpinnerIcon /> : "Save"}
                        </Button>
                      </DialogFooter>
                    </AutoFormSubmit>
                  </AutoForm>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {profileData?.data?.role === RoleEnum.MANAGER && (
            <div className="mb-2 flex items-center justify-start gap-2  rounded-md border-b-2 bg-gray-500 p-2 font-bold text-white shadow-sm">
              <b className="text-2xl">{availableCourts}</b> Available courts in
              your current plan
            </div>
          )}
          {profileData?.data?.role === RoleEnum.CUSTOMER ||
          profileData?.data?.role === RoleEnum.MANAGER ? (
            <>
              <span className="flex items-center  justify-between border-b py-2 font-semibold">
                Bank Card
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
              </span>

              <div className="flex  w-full flex-col gap-2 overflow-auto p-2">
                {isCardListLoading ? (
                  <div className="flex size-full justify-center p-2">
                    <Loading />
                  </div>
                ) : cardList?.data?.length ? (
                  cardList?.data.map((card) => (
                    <div className="flex items-center space-x-2" key={card._id}>
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
                  ))
                ) : (
                  <div className="flex w-full justify-center text-sm">
                    Your card list is empty
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              These feature are coming soon! <Rocket />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
