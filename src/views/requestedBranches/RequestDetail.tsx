"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Hourglass, X } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import { z } from "zod";

import {
  getBranchByIdAPI,
  handleRequestBranchAPI,
} from "@/apiCallers/Branches";
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
import AutoForm from "@/components/ui/auto-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import defaultFile from "@/public/assets/images/fileIcon.png";
import { BranchStatusEnum } from "@/types";
import CourtDialog from "@/views/courts/CourtDialog";

import type { SlotSchemaType } from "../branches/create/slide/AvailableSlot";
import { detailsFormSchema } from "../branches/create/slide/BranchDetails";
import { amountFormSchema } from "../branches/create/slide/CourAvailability";
import { PeriodTimeFieldType } from "../branches/create/slide/PeriodTimeField";
import SlotDialog from "../branches/SlotDialog";

export const workingTimeFormSchemaAdminRequest = z.object({
  availableTime: z.coerce.string({
    // Add a validation message for the field
    message: "Available time is required",
  }),
});
type Props = {
  branchId: string;
};

const RequestDetail = ({ branchId }: Props) => {
  const { data: branchData, isLoading } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: async () => getBranchByIdAPI(branchId),
  });
  console.log(branchData);
  const branch = branchData?.data;
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
  const { mutateAsync: triggerResolveRequest, isPending } = useMutation({
    mutationFn: async (data: { approve: boolean; branchId: string }) => {
      return handleRequestBranchAPI(data);
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
  const [acceptDialog, setAcceptDialog] = React.useState(false);
  const [rejectDialog, setRejectDialog] = React.useState(false);
  const queryClient = useQueryClient();
  const handleRequest = async (approve: boolean) => {
    try {
      await triggerResolveRequest({ approve, branchId });
      setAcceptDialog(false);
      setRejectDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["branch", branchId],
      });
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
          <div className="flex w-full items-center justify-end gap-4">
            <div className="mr-auto flex items-center gap-2 text-2xl font-semibold">
              Review request
              <span className="text-xl font-semibold">{branch?.name}</span>
              <Badge variant="default" className="bg-green-500">
                {branch?.status}
              </Badge>
              <span className="text-xs text-gray-400" />
            </div>
            {branch.status === BranchStatusEnum.PENDING && (
              <>
                <AlertDialog open={rejectDialog} onOpenChange={setRejectDialog}>
                  <AlertDialogTrigger>
                    <Button
                      className="flex items-center gap-2 opacity-50 hover:opacity-100 "
                      variant="destructive"
                    >
                      <X /> Reject request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please read request and confirm that you will reject
                        this request, this action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        onClick={() => handleRequest(false)}
                        disabled={isPending}
                        variant="destructive"
                        className="flex w-40 items-center justify-center"
                      >
                        {isPending ? <SpinnerIcon /> : "Reject"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={acceptDialog} onOpenChange={setAcceptDialog}>
                  <AlertDialogTrigger>
                    <Button
                      className="flex items-center gap-2  opacity-50 hover:opacity-100"
                      variant="default"
                    >
                      <CheckCheck /> Accept request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please read request and confirm that you will accept
                        this request, this action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        onClick={() => handleRequest(true)}
                        disabled={isPending}
                        variant="default"
                        className="flex w-40 items-center justify-center"
                      >
                        {isPending ? <SpinnerIcon /> : "Accept"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
          <div className="w-full flex-1 ">
            <div className=" relative  mx-auto  w-[600px] lg:w-[800px]">
              <div className="relative flex w-full items-center pr-2">
                <div className="mt-10 flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold ">
                      Court availability
                    </span>
                    <AutoForm
                      formSchema={amountFormSchema}
                      values={{
                        amount: branch?.courts.length,
                      }}
                      fieldConfig={{
                        amount: {
                          inputProps: {
                            disabled: true,
                            value: branch?.courts.length,
                            placeholder: "Amount of court",
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">
                      Branch details
                    </span>
                    <AutoForm
                      formSchema={detailsFormSchema}
                      values={{
                        name: branch?.name,
                        phone: branch?.phone,
                        address: branch?.address,
                        description: branch?.description,
                      }}
                      fieldConfig={{
                        name: {
                          inputProps: {
                            placeholder: "Branch name",
                            defaultValue: "Boon Lay Branch",
                            disabled: true,
                          },
                        },
                        phone: {
                          inputProps: {
                            placeholder: "Phone number",
                            defaultValue: "12345678",
                            disabled: true,
                          },
                        },
                        address: {
                          inputProps: {
                            placeholder: "Address",
                            defaultValue: "Boon Lay",
                            disabled: true,
                          },
                        },
                        description: {
                          inputProps: {
                            placeholder: "Description",
                            defaultValue: "Boon Lay Branch",
                            disabled: true,
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
                    <span className="border-b font-semibold">Images</span>
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
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">Licenses</span>
                    <div className="flex w-full flex-col gap-2">
                      {branch?.licenses.map((license, index) => (
                        <a
                          key={license.name}
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
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">
                      Courts registration
                    </span>
                    <div className="grid w-full grid-cols-4 gap-10 overflow-auto">
                      {branch?.courts &&
                        branch?.courts.map((item: any) => (
                          <CourtDialog
                            // disabled
                            readonly
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
                            description="Court Information, you can only view the court information"
                            title="Court Information"
                            key={item.name}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">Open time</span>
                    <AutoForm
                      values={{
                        availableTime: branch?.availableTime,
                      }}
                      formSchema={workingTimeFormSchemaAdminRequest}
                      fieldConfig={{
                        availableTime: {
                          fieldType: PeriodTimeFieldType,
                          inputProps: {
                            disabled: true,
                            value: branch?.availableTime,
                          },
                          // fieldType: TimePickerDemo,
                        },
                      }}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
                    <span className="border-b font-semibold">
                      Slot registration
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
                                        key={
                                          slot.startTime +
                                          slot.endTime +
                                          slot.weekDay
                                        }
                                        Trigger={
                                          <Badge
                                            key={slot.startTime + slot.endTime}
                                            variant="secondary"
                                            className="col-span-4 flex cursor-pointer items-center gap-1 py-2 transition-all duration-300 ease-in  hover:bg-gray-400"
                                          >
                                            <Hourglass className="text-sm" />
                                            <span className="text-xs">
                                              {`${slot.startTime}-${slot.endTime}`}
                                            </span>
                                          </Badge>
                                        }
                                        defaultValue={slot}
                                        title="View Slot Information"
                                        description="Slot information, turn back if there is any mistake"
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
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

export default RequestDetail;
