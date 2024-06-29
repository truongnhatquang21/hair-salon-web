import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, Hourglass, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { IconRight } from "react-day-picker";

import { postBranchListAPI } from "@/apiCallers/Branches";
import { uploadFileAPI, uploadImagesAPI } from "@/apiCallers/file";
import SpinnerIcon from "@/components/SpinnerIcon";
import AutoForm from "@/components/ui/auto-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Steppers } from "@/hooks/useStepper";
import defaultFile from "@/public/assets/images/fileIcon.png";
import { useBranchStepStore } from "@/stores/createBranchStore";
import CourtDialog from "@/views/courts/CourtDialog";

import type { BranchTypeInCreate } from "../../helper";
import SlotDialog from "../../SlotDialog";
import type { SlotSchemaType } from "./AvailableSlot";
import { detailsFormSchema } from "./BranchDetails";
import { amountFormSchema } from "./CourAvailability";
import type { CourtType } from "./CourtRegistration";
import { PeriodTimeFieldType } from "./PeriodTimeField";
import { workingTimeFormSchema } from "./WorkingTime";

type Props = {
  stepIndex: number;
  goNextFn?: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};

const Confirmation = ({ goBackfn, goNextFn, steppers, stepIndex }: Props) => {
  const steps = useBranchStepStore((state) => state.stepStore);
  const toast = useToast();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const slots = (steps[7]?.data as { slots: SlotSchemaType[] })?.slots;
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

  const { isPending: isUploadImage, mutateAsync: triggerUploadImages } =
    useMutation({
      mutationFn: async (files: File[]) => {
        const formData = new FormData();

        for (const file of files) {
          formData.append("files", file, file.name);
        }

        return uploadImagesAPI(formData);
      },
    });
  const { isPending: isUploadLicense, mutateAsync: triggerUploadLicense } =
    useMutation({
      mutationFn: async (files: File[]) => {
        const formData = new FormData();

        for (const file of files) {
          formData.append("files", file, file.name);
        }
        return uploadFileAPI(formData);
      },
    });

  const { isPending: isPostBranch, mutateAsync: triggerPostBranch } =
    useMutation({
      mutationFn: async (data: any) => {
        return postBranchListAPI(data);
      },
    });

  const router = useRouter();

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex w-full items-center gap-4">
        <Button
          className="mr-auto flex select-none items-center justify-center gap-2 px-4"
          disabled={stepIndex === 0}
          onClick={() => {
            goBackfn();
          }}
        >
          <ChevronLeft />
          Back
        </Button>

        <span className="flex flex-1 items-center justify-center text-center text-xl font-semibold">
          Step-{stepIndex}
          <IconRight />{" "}
          <h1 className="text-center text-2xl font-bold uppercase">
            Confirmation
          </h1>
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        Please review the information before submitting, you can go back to
        refill the form if there is any mistake.
      </div>
      <div className="relative flex w-full items-center border-t  pr-2">
        <div className="mt-10 flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold ">Court availability</span>
            <AutoForm
              values={steps[1]?.data}
              formSchema={amountFormSchema}
              fieldConfig={{
                amount: {
                  inputProps: {
                    disabled: true,
                    defaultValue: 1,
                    placeholder: "Amount of court",
                  },
                },
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold">Branch details</span>
            <AutoForm
              values={steps[2]?.data}
              formSchema={detailsFormSchema}
              fieldConfig={{
                name: {
                  inputProps: {
                    placeholder: "--",
                    defaultValue: "Boon Lay Branch",
                    disabled: true,
                  },
                },
                phone: {
                  inputProps: {
                    placeholder: "--",
                    defaultValue: "12345678",
                    disabled: true,
                  },
                },
                address: {
                  inputProps: {
                    placeholder: "--",
                    defaultValue: "Boon Lay",
                    disabled: true,
                  },
                },
                description: {
                  inputProps: {
                    placeholder: "--",
                    defaultValue: "Boon Lay Branch",
                    disabled: true,
                  },
                },
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold">Images</span>
            <div className="grid  w-full grid-cols-6 gap-2">
              {steps[3]?.data?.images.map((image) => (
                <div
                  className="col-span-2 flex items-center rounded-md border p-2"
                  key={image.name}
                >
                  <a
                    href={URL.createObjectURL(image)}
                    download
                    className="flex size-full items-center justify-center"
                  >
                    <Image
                      width={40}
                      height={40}
                      src={URL.createObjectURL(image)}
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
              {steps[4]?.data?.licenses.map((license) => (
                <a
                  key={license.name}
                  className="w-full "
                  href={URL.createObjectURL(license)}
                  download
                >
                  <div className="flex w-full cursor-pointer items-center gap-2 rounded-md bg-gray-50 p-2 transition-all duration-200 ease-in hover:bg-accent">
                    <Image
                      src={defaultFile}
                      alt="fileImage"
                      className="size-4 object-contain"
                    />
                    <span className="hover:underline">{license.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold">Courts registration</span>
            <div className="grid w-full grid-cols-4 gap-10 overflow-auto">
              {steps[5]?.data?.courts.map((item: CourtType) => (
                <CourtDialog
                  // disabled
                  readonly
                  Trigger={
                    <div className="relative z-10 col-span-2 flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-3 shadow-sm hover:bg-accent">
                      <Image
                        width={20}
                        height={20}
                        alt="defaultBadminton"
                        src={URL.createObjectURL(item.images[0])}
                        className="size-20 rounded-md object-cover shadow-md"
                      />
                      <div className="flex flex-1 flex-col gap-1 ">
                        <span className="text-lg font-semibold">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-700 underline underline-offset-2">
                          {item.price} VND
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
                  description="Court information, turn back if there is any mistake"
                  title="Court Information"
                  key={item.name}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold">Open time</span>
            <AutoForm
              values={steps[6]?.data}
              formSchema={workingTimeFormSchema}
              fieldConfig={{
                availableTime: {
                  fieldType: PeriodTimeFieldType,
                  inputProps: {
                    disabled: true,
                    value: steps[6]?.data?.availableTime,
                  },
                  // fieldType: TimePickerDemo,
                },
                SlotPeriod: {
                  inputProps: {
                    required: false,
                    disabled: true,
                    placeholder: "Slot Period",
                    value: 30,
                  },
                },
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
            <span className="border-b font-semibold">Slot registration</span>
            <div className="flex w-full flex-col gap-2 overflow-auto">
              <div className="flex w-full flex-col gap-2">
                {slotMaping &&
                  Object.keys(slotMaping).map((key) => {
                    return (
                      <div key={key} className="flex w-full flex-col gap-2">
                        <span className="font-semibold">{key}</span>
                        <div className="grid grid-cols-12 gap-2">
                          {slotMaping[key]?.map((slot) => {
                            return (
                              <SlotDialog
                                key={
                                  slot.startTime + slot.endTime + slot.weekDay
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
      <Button
        disabled={isPostBranch || isUploadImage || isUploadLicense}
        type="submit"
        className="flex h-72 w-full select-none items-center justify-center gap-2 px-4"
        onClick={async () => {
          const prepaeData: BranchTypeInCreate = steps.reduce((acc, item) => {
            return { ...acc, ...item.data };
          }, {} as BranchTypeInCreate);
          console.log(prepaeData, "ODAOSF");
          console.log("license", prepaeData.licenses);

          await Promise.all([
            triggerUploadImages(prepaeData.images),
            triggerUploadLicense(prepaeData.licenses),
          ])
            .then((res) => {
              prepaeData.images = res[0].data;
              prepaeData.licenses = res[1].data;
            })
            .catch(() => {
              toast.toast({
                title: "Error",
                description: "Error while uploading images",
                variant: "destructive",
              });
            });
          await triggerPostBranch(prepaeData)
            .then(() => {
              toast.toast({
                title: "Success",
                description: "Branch sent to review successfully",
                className: "bg-green-600 text-white",
              });
              router.push("/dashboard/branches");
            })
            .catch(() => {
              toast.toast({
                title: "Error",
                description: "Error while sending branch to review",
                variant: "destructive",
              });
            });
        }}
      >
        {isPostBranch || isUploadImage || isUploadLicense ? (
          <SpinnerIcon />
        ) : (
          <>
            Finish and Submit for Review
            <Send />
          </>
        )}
      </Button>
    </div>
  );
};

export default Confirmation;
