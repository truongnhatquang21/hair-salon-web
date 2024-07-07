"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgePlus, Hourglass, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  type BranchSchemaTypeWithId,
  getBranchByIdAPI,
  updateInformationBranchAPI,
  updateStatusBranchAPI,
} from "@/apiCallers/Branches";
import type { CourtType } from "@/apiCallers/courts";
import { postSlotAPI } from "@/apiCallers/slot";
import { Loading } from "@/components/loading";
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
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import FileUploadModal from "@/components/UploadImage/fileUploadModal";
import defaultFile from "@/public/assets/images/fileIcon.png";
import { BranchStatusEnum } from "@/types";
import CourtDialog from "@/views/courts/CourtDialog";

import DeleteSubsBtn from "./create/DeleteSubsBtn";
import { SlotSchema, type SlotSchemaType } from "./create/slide/AvailableSlot";
import { detailsFormSchema } from "./create/slide/BranchDetails";
import {
  PeriodTimeFieldType,
  TimeFieldType,
} from "./create/slide/PeriodTimeField";
import { type BranchSchemaType, createBranchSchema } from "./helper";
import SlotDialog from "./SlotDialog";

export const workingTimeFormSchemaAdminRequest = z.object({
  availableTime: z.coerce.string({
    // Add a validation message for the field
    message: "Available time is required",
  }),
});
type Props = {
  branchId: string;
};

const BranchDetail = ({ branchId }: Props) => {
  const form = useForm<BranchSchemaType>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      description: "",
      images: [],
      licenses: [],
      availableTime: "",
      courts: [],
      slots: [],
      status: BranchStatusEnum.PENDING,
    },
    mode: "onChange",
  });

  const { data: branchData, isLoading } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: async () => getBranchByIdAPI(branchId),
  });

  useEffect(() => {
    if (branchData?.data) {
      form.reset(branchData.data, {
        keepDirty: false,
      });
    }
  }, [branchData?.data]);

  const branch = form.getValues();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const slots = ({ slots: branch?.slots } as { slots: SlotSchemaType[] })
    ?.slots;
  const slotMaping = useMemo(() => {
    const result: { [key: string]: SlotSchemaType[] } = {};
    const data = slots;
    if (!data || data.length === 0) {
      return null;
    }
    data.forEach((item) => {
      if (!result[item.weekDay]) {
        result[item.weekDay] = [item];
      } else {
        result[item.weekDay]?.push(item);
        result[item.weekDay]?.sort((a, b) => {
          const aTime = a.startTime.split(":");
          const bTime = b.startTime.split(":");
          const isHourCompare =
            Number(aTime[0] as string) - Number(bTime[0] as string);
          if (isHourCompare === 0) {
            return Number(aTime[1] as string) - Number(bTime[1] as string);
          }
          return isHourCompare;
        });
      }
    });
    const sortedObject = Object.fromEntries(
      Object.entries(result).sort(
        ([a], [b]) => weekdays.indexOf(a) - weekdays.indexOf(b)
      )
    );
    return sortedObject;
  }, [slots]);

  const { toast } = useToast();

  const [acceptDialog, setAcceptDialog] = React.useState(false);

  const queryClient = useQueryClient();

  const disabled = useMemo(() => {
    if (
      branch?.status === BranchStatusEnum.PENDING ||
      branch?.status === BranchStatusEnum.INACTIVE ||
      branch?.status === BranchStatusEnum.ACTIVE
    ) {
      return false;
    }
    return true;
  }, [branch?.status]);

  const {
    mutateAsync: handleUpdateStatusTrigger,
    isPending: isHandleUpdateStatus,
  } = useMutation({
    mutationFn: async (data: {
      branchId: string;
      status: BranchStatusEnum;
    }) => {
      return updateStatusBranchAPI(data);
    },
    onSuccess: (data) => {
      console.log(data, "data");
      if (!data.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });

        return;
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
      console.error("Error while posting branch", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error while posting branch",
      });
    },
  });
  const handleUpdateStatus = async (status: BranchStatusEnum) => {
    try {
      await handleUpdateStatusTrigger({ branchId, status });
      queryClient.invalidateQueries({
        queryKey: ["branch", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myBranches"],
      });
      setAcceptDialog(false);
    } catch (e) {
      console.error(e);
    }
  };

  const {
    mutateAsync: handleUpdateBrachData,
    isPending: isHandleUpdateBranchData,
  } = useMutation({
    mutationFn: async (data: BranchSchemaTypeWithId) => {
      return updateInformationBranchAPI(data);
    },
    onSuccess: (data) => {
      console.log(data, "data");
      if (!data.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });

        return;
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
      console.error("Error while posting branch", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error while posting branch",
      });
    },
  });

  const handleUpdateBranchInformation = async (data: BranchSchemaType) => {
    const isFormValid = await form.trigger();
    console.log(data, "adsaos");

    if (!isFormValid) {
      toast({
        title: "Error",
        description: "Please check your form again",
        variant: "destructive",
      });
    }
    try {
      const prepareData: BranchSchemaTypeWithId = {
        ...data,
        _id: branchId,
      };
      await handleUpdateBrachData(prepareData);
      queryClient.invalidateQueries({
        queryKey: ["branch", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myBranches"],
      });
    } catch (e) {
      console.error(e);
    }
  };
  const header = useMemo(() => {
    if (branch?.status === BranchStatusEnum.PENDING) {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-end gap-4">
            <div className="mr-auto flex items-center gap-2 text-2xl font-semibold">
              Branch Detail
              <Badge
                variant="default"
                className="bg-yellow-500 px-4 py-2 text-xl text-white"
              >
                {branch?.status}
              </Badge>
              <span className="text-xl font-semibold">{branch?.name}</span>
              <span className="text-xs text-gray-400" />
            </div>
            <Button
              onClick={() => handleUpdateBranchInformation(form.getValues())}
              disabled={isHandleUpdateBranchData}
              variant="default"
              className="flex items-center justify-center"
            >
              {isHandleUpdateBranchData ? <SpinnerIcon /> : "Update"}
            </Button>
          </div>
          <div
            className="mb-4 flex items-center rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            <svg
              className="me-3 inline size-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">Warning alert!</span>
              This branch is in pending status, you can update your branch
              information if needed. The admin will review your branch and make
              a decision.
            </div>
          </div>
        </div>
      );
    }
    if (branch?.status === BranchStatusEnum.ACTIVE) {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-end gap-4">
            <div className="mr-auto flex items-center gap-2 text-2xl font-semibold">
              Branch Detail
              <Badge
                variant="default"
                className="bg-green-500 px-4 py-2 text-xl text-white"
              >
                {branch?.status}
              </Badge>
              <span className="text-xl font-semibold">{branch?.name}</span>
              <span className="text-xs text-gray-400" />
            </div>
            <Button
              onClick={() => handleUpdateBranchInformation(form.getValues())}
              disabled={isHandleUpdateBranchData}
              variant="default"
              className="flex items-center justify-center"
            >
              {isHandleUpdateBranchData ? <SpinnerIcon /> : "Update"}
            </Button>
            <AlertDialog open={acceptDialog} onOpenChange={setAcceptDialog}>
              <AlertDialogTrigger>
                <Button className="flex items-center gap-2 " variant="default">
                  Inactive branch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Inactive branch will not be able to accept any booking,
                    please confirm this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={() =>
                      handleUpdateStatus(BranchStatusEnum.INACTIVE)
                    }
                    disabled={isHandleUpdateStatus}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    {isHandleUpdateStatus ? <SpinnerIcon /> : "Accept"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div
            className="mb-4 flex items-center rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <svg
              className="me-3 inline size-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">
                This branch is currently active.
              </span>{" "}
              You can update your branch information or inactive your branch if
              needed.
            </div>
          </div>
        </div>
      );
    }
    if (branch?.status === BranchStatusEnum.INACTIVE) {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-end gap-4">
            <div className="mr-auto flex items-center gap-2 text-2xl font-semibold">
              Branch Detail
              <Badge
                variant="default"
                className="bg-blue-500 px-4 py-2 text-xl text-white"
              >
                {branch?.status}
              </Badge>
              <span className="text-xl font-semibold">{branch?.name}</span>
              <span className="text-xs text-gray-400" />
            </div>
            <Button
              onClick={() => handleUpdateBranchInformation(form.getValues())}
              disabled={isHandleUpdateBranchData}
              variant="default"
              className="flex items-center justify-center"
            >
              {isHandleUpdateBranchData ? <SpinnerIcon /> : "Update"}
            </Button>
            <AlertDialog open={acceptDialog} onOpenChange={setAcceptDialog}>
              <AlertDialogTrigger>
                <Button className="flex items-center gap-2" variant="default">
                  Active branch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Active branch will be able to accept any booking, please
                    confirm this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={() => handleUpdateStatus(BranchStatusEnum.ACTIVE)}
                    disabled={isHandleUpdateStatus}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    {isHandleUpdateStatus ? <SpinnerIcon /> : "Accept"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div
            className="mb-4 flex items-center rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <svg
              className="me-3 inline size-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Your branch is inactive</span> You
              can update your branch information. If you want to accept booking,
              please <b>Active</b> your branch.
            </div>
          </div>
        </div>
      );
    }
    if (branch?.status === BranchStatusEnum.DENIED) {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-end gap-4">
            <div className="mr-auto flex items-center gap-2 text-2xl font-semibold">
              Branch Detail
              <Badge
                variant="default"
                className="bg-red-500 px-4 py-2 text-xl text-white"
              >
                {branch?.status}
              </Badge>
              <span className="text-xl font-semibold">{branch?.name}</span>
              <span className="text-xs text-gray-400" />
            </div>
          </div>
          <div
            className="mb-4 flex items-center rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              className="me-3 inline size-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Your branch is rejected.</span>{" "}
              Please contact the admin for more information. If you want to
              create a new branch, please re-submit your branch request again.
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, [
    form,
    handleUpdateBranchInformation,
    isHandleUpdateBranchData,
    branch?.status,
    isHandleUpdateStatus,
    handleUpdateStatus,
    branch?.name,

    setAcceptDialog,
    acceptDialog,
  ]);

  const editCourt = (name: string, payload: CourtType) => {
    const court = form.getValues("courts");
    if (court && court?.length > 0) {
      const checkCourt = court?.find(
        (item) => name !== item.name && item.name === payload.name
      );
      if (checkCourt) {
        toast({
          title: "Error",
          description: "Court name is already exist",
          variant: "destructive",
        });
        return false;
      }
    }
    const newCourt = court?.map((item: CourtType) => {
      if (item.name === name) {
        return payload;
      }
      return item;
    });
    form.setValue("courts", newCourt);
    toast({
      title: "Success",
      description: "Court has been updated",
      className: "bg-green-600 text-white",
    });

    return true;
  };

  const editSlot = (slot: SlotSchemaType, payload: SlotSchemaType) => {
    const slotsData = form.getValues("slots");
    const newSlots = slotsData.map((item) => {
      if (
        item.weekDay === slot.weekDay &&
        item.startTime === slot.startTime &&
        item.endTime === slot.endTime
      ) {
        return payload;
      }
      return item;
    });
    form.setValue("slots", newSlots);
    toast({
      title: "Success",
      description: "Slot has been updated",
      className: "bg-green-600 text-white",
    });
    return true;
  };
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { mutateAsync: handleCreateSlot, isPending: isHandleCreateSlot } =
    useMutation({
      mutationFn: async (
        data: SlotSchemaType & {
          branchId: string;
        }
      ) => {
        return postSlotAPI(data);
      },
      onSuccess: (data) => {
        console.log(data, "data");
        if (!data.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.message || data.statusText,
          });

          return;
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
        console.error("Error while posting branch", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error while posting branch",
        });
      },
    });
  const slotCreate = async (data: SlotSchemaType) => {
    try {
      const prepareData = {
        ...data,
        branchId,
      };

      console.log(prepareData, "prepareData");

      await handleCreateSlot(prepareData);
      queryClient.invalidateQueries({
        queryKey: ["branch", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myBranches"],
      });
      setIsDialogOpen(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="size-full">
      {isLoading ? (
        <div className="flex size-full items-center justify-center">
          <Loading />
        </div>
      ) : branchData?.data ? (
        <div className="flex size-full flex-col items-center gap-2">
          {header}
          <div className="w-full flex-1 ">
            <div className=" relative  mx-auto  w-[600px] lg:w-[800px]">
              <div className="relative flex w-full items-center pr-2">
                <div className="mt-10 flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">
                      Branch details
                    </span>
                    <AutoForm
                      formSchema={detailsFormSchema}
                      controlForm={form}
                      values={{
                        name: branch?.name,
                        phone: branch?.phone,
                        address: branch?.address,
                        description: branch?.description,
                      }}
                      fieldConfig={{
                        name: {
                          inputProps: {
                            placeholder: "--",
                            defaultValue: "",
                            disabled,
                          },
                        },
                        phone: {
                          inputProps: {
                            placeholder: "--",
                            defaultValue: "",
                            disabled,
                          },
                        },
                        address: {
                          inputProps: {
                            placeholder: "--",
                            defaultValue: "",
                            disabled,
                          },
                        },
                        description: {
                          inputProps: {
                            placeholder: "--",
                            defaultValue: "",
                            disabled,
                          },
                        },
                      }}
                    >
                      {/* <AutoFormSubmit>
        <Button className="flex items-center gap-2">Create</Button>
      </AutoFormSubmit> */}
                    </AutoForm>
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="flex border-b font-semibold">
                      Images
                      {!disabled && (
                        <div className="ml-auto">
                          <FileUploadModal
                            field={{
                              value: branch?.images,
                              onChange: (value: string[]) =>
                                form.setValue("images", value),
                            }}
                            isRequired
                            label="Images"
                            defaultValue={branch?.images}
                            accetp={{
                              "image/*": [".jpeg", ".png"],
                            }}
                          />
                        </div>
                      )}
                    </span>

                    <div className="grid  w-full grid-cols-6 gap-2">
                      {branch?.images.map((image, index) => (
                        <div
                          className="col-span-2 flex items-center rounded-md border p-2"
                          key={image}
                        >
                          <a
                            href={image}
                            target="_blank"
                            download
                            className="flex size-full items-center justify-center"
                          >
                            <Image
                              width={40}
                              height={40}
                              src={image}
                              alt="image"
                              className="h-40 w-full object-contain"
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.images && (
                      <span className="text-sm font-medium text-destructive">
                        {form.formState.errors.images?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    {" "}
                    <span className="flex border-b font-semibold">
                      Licenses
                      {!disabled && (
                        <div className="ml-auto">
                          <FileUploadModal
                            field={{
                              value: branch.licenses,
                              onChange: (value: string[]) => {
                                form.setValue("licenses", value);
                              },
                            }}
                            isRequired
                            label="Licenses"
                            defaultValue={branch?.licenses}
                            accetp={{
                              "image/*": [".jpeg", ".png", `.jpg`],
                              "application/pdf": [".pdf"],
                              "application/msword": [".doc"],
                            }}
                          />
                        </div>
                      )}
                    </span>
                    <div className="flex w-full flex-col gap-2">
                      {branch?.licenses.map((license, index) => (
                        <a
                          key={license}
                          className="w-full "
                          href={license}
                          download
                          target="_blank"
                        >
                          <div className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-gray-50 p-2 transition-all duration-200 ease-in hover:bg-accent">
                            <Image
                              width={40}
                              height={40}
                              src={
                                license.includes(
                                  "https://storage.googleapis.com/"
                                ) &&
                                (license.includes(".png") ||
                                  license.includes(".jpg") ||
                                  license.includes(".jpeg"))
                                  ? license
                                  : defaultFile
                              }
                              alt="fileImage"
                              className="size-4 object-contain"
                            />
                            <span className="hover:underline">
                              {license.name || "License"}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                    {form.formState.errors.licenses && (
                      <span className="text-sm font-medium text-destructive">
                        {form.formState.errors.licenses?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="flex items-center border-b p-2 font-semibold">
                      Courts registration
                    </span>
                    {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="ml-auto flex items-center gap-3"
                          disabled={
                            form?.watch("courts") &&
                            form?.watch("courts").length >=
                              steps[1]?.data.amount
                          }
                        >
                          <BadgePlus /> Add Court
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex h-3/5 w-[600px] flex-col overflow-auto sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Add new court</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to add a new court
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative w-full flex-1 gap-4 overflow-auto p-2">
                          <AutoForm
                            onSubmit={courtCreate}
                            formSchema={courtSchema}
                            fieldConfig={{
                              images: {
                                fieldType: FieldType,
                              },
                              status: {
                                inputProps: {
                                  readOnly: true,
                                  disabled: true,
                                  defaultValue: CourtStatusEnum.PENDING,
                                },
                              },
                              description: {
                                fieldType: "textarea",
                              },
                            }}
                          >
                            <DialogFooter className="w-full">
                              <AutoFormSubmit className="w-full">
                                <Button className="w-full" type="submit">
                                  Save Court
                                </Button>
                              </AutoFormSubmit>
                            </DialogFooter>
                          </AutoForm>
                        </div>
                      </DialogContent>
                    </Dialog> */}
                    <div className="grid w-full grid-cols-4 gap-10 overflow-auto">
                      {branch?.courts &&
                        branch?.courts.map((item: any) => (
                          <CourtDialog
                            readOnly={disabled}
                            onSubmit={(data) => {
                              const res = editCourt(item.name, data);
                              return res;
                            }}
                            invalidateKey={["branch", branchId]}
                            Trigger={
                              <div className="relative z-10 col-span-2 flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-3 shadow-sm hover:bg-accent">
                                <Image
                                  width={20}
                                  height={20}
                                  alt="defaultBadminton"
                                  src={item.images[0]}
                                  className="size-20 rounded-md object-cover shadow-md"
                                />
                                <div className="flex flex-1 flex-col gap-1 ">
                                  <span className="text-lg font-semibold">
                                    {item.name}
                                  </span>
                                  <span className="text-sm text-gray-700 underline underline-offset-2">
                                    $ {item.price}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.type}
                                  </span>
                                </div>
                              </div>
                            }
                            defaultValue={item}
                            description="Fill out the form below to update court"
                            title="Update court"
                            key={item.name}
                          />
                        ))}
                    </div>
                    {form.formState.errors.courts && (
                      <span className="text-sm font-medium text-destructive">
                        {form.formState.errors.courts?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">Open time</span>
                    <AutoForm
                      controlForm={form}
                      values={{
                        availableTime: branch?.availableTime,
                      }}
                      formSchema={workingTimeFormSchemaAdminRequest}
                      fieldConfig={{
                        availableTime: {
                          fieldType: PeriodTimeFieldType,
                          inputProps: {
                            disabled,
                            defaultValue: branch?.availableTime,
                            value: branch?.availableTime,
                          },
                          // fieldType: TimePickerDemo,
                        },
                      }}
                    />
                    {
                      form.formState.errors.availableTime && (
                        <span className="text-sm font-medium text-destructive">
                          {form.formState.errors.availableTime?.message}
                        </span>
                      ) // <span className="text-sm font-medium text-destructive">Available time is required</span>
                    }
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="flex items-center justify-between border-b font-semibold">
                      Slot registration
                      {!disabled && (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="ml-auto flex items-center gap-3">
                              <BadgePlus /> Add slot
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80%] overflow-auto sm:max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Add new slot</DialogTitle>
                              <DialogDescription>
                                Fill out the form below to add a new court
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <AutoForm
                                onSubmit={slotCreate}
                                formSchema={SlotSchema}
                                fieldConfig={{
                                  startTime: {
                                    fieldType: TimeFieldType,
                                    // fieldType: TimePickerDemo,
                                    description:
                                      "Start time must be a valid time",
                                  },
                                  endTime: {
                                    fieldType: TimeFieldType,
                                    // fieldType: TimePickerDemo,
                                    description:
                                      "End time must be a valid time",
                                  },

                                  weekDay: {
                                    inputProps: {
                                      placeholder: "Week Day",
                                    },
                                  },
                                  surcharge: {
                                    inputProps: {
                                      placeholder: "Surcharge",
                                      defaultValue: 0,
                                    },
                                    description:
                                      "Surcharge must be a positive number",
                                  },
                                }}
                              >
                                <AutoFormSubmit className="w-full">
                                  <DialogFooter className="w-full">
                                    <Button
                                      className="flex w-full items-center justify-center"
                                      type="submit"
                                    >
                                      {isHandleCreateSlot ? (
                                        <SpinnerIcon />
                                      ) : (
                                        "Save Slot"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </AutoFormSubmit>
                              </AutoForm>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </span>
                    <div className="flex w-full flex-col gap-2 overflow-auto">
                      <div className="flex w-full flex-col gap-2">
                        {slotMaping &&
                          Object.keys(slotMaping).map((key) => {
                            return (
                              <div
                                key={key}
                                className="flex w-full flex-col gap-2"
                              >
                                <span className="font-semibold">{key}</span>
                                <div className="grid grid-cols-12 gap-2">
                                  {slotMaping[key]?.map((slot) => {
                                    return (
                                      <SlotDialog
                                        invalidateKey={["branch", branchId]}
                                        key={
                                          slot.startTime +
                                          slot.endTime +
                                          slot.weekDay
                                        }
                                        isViewOnly={disabled}
                                        Trigger={
                                          <Badge
                                            key={slot.startTime + slot.endTime}
                                            variant="secondary"
                                            className="col-span-4 flex cursor-pointer items-center  gap-1 py-2 transition-all duration-300 ease-in  hover:bg-gray-400"
                                          >
                                            <Hourglass className="text-sm" />
                                            <span className="text-xs">
                                              {`${slot.startTime}-${slot.endTime}`}
                                            </span>
                                            {!disabled && (
                                              <div className="ml-auto">
                                                <DeleteSubsBtn
                                                  Trigger={
                                                    <Trash className="bottom-1 right-1 z-30 ml-auto rounded-full bg-red-200 p-2 text-red-700 opacity-40 shadow-md transition-all duration-300 ease-in hover:scale-125 hover:opacity-100" />
                                                  }
                                                  invalidateKey={[
                                                    "branch",
                                                    branchId,
                                                  ]}
                                                  id={slot._id}
                                                />
                                              </div>
                                            )}
                                          </Badge>
                                        }
                                        defaultValue={slot}
                                        onSubmit={(data) => {
                                          return editSlot(slot, data);
                                        }}
                                        title="Edit slot"
                                        description="Fill out the form below to edit the slot"
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    {form.formState.errors.slots && (
                      <span className="text-sm font-medium text-destructive">
                        {form.formState.errors.slots?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <div>Branch not found</div>
        </div>
      )}
    </div>
  );
};

export default BranchDetail;
