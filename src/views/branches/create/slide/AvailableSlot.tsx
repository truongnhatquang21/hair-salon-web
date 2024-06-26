import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgePlus,
  ChevronLeft,
  ChevronRight,
  Hourglass,
  Trash,
  ZapIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { IconRight } from "react-day-picker";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
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
import type { Steppers } from "@/hooks/useStepper";
import { useBranchStepStore } from "@/stores/createBranchStore";
import { WeekDayEnum } from "@/types";

import { TimeFieldType } from "./PeriodTimeField";

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
const SlotSchema = z.object({
  weekDay: z.nativeEnum(WeekDayEnum, {
    message: "Week day is required",
  }),
  startTime: z.string({
    // Add a validation message for the field
    message: "Available time is required",
  }),
  endTime: z.string({
    // Add a validation message for the field
    message: "Available time is required",
  }),
  surcharge: z.coerce
    .number({
      // Add a validation message for the field
      message: "Surcharge must be a >= 0 number",
    })
    .gte(0)
    .default(0),
});
const formSchema = z.object({
  slots: z
    .array(SlotSchema)
    .describe("Courts information")
    .nonempty("At least one court is required"),
});

type SlotSchemaType = z.infer<typeof SlotSchema>;
type FormSchemaType = z.infer<typeof formSchema>;
const AvailableSlot = ({ steppers, goBackfn, goNextFn, stepIndex }: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {}) as FormSchemaType;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const validateForm = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please check your form again",
      });
    }
  };
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data.slots.length, "data");
    if (!data.slots || data.slots.length === 0) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please add court to continue",
      });
    } else {
      setBranchStep({
        step: stepIndex,
        data,
      });
      toast({
        title: "Success",
        description:
          "Your data has been saved in draft, if you want to continue please click next button",
        className: "bg-green-600 text-white",
      });
      goNextFn(stepIndex + 1);

      console.log(branchStep, "branchStep");
    }
  };
  const slotCreate = (data: SlotSchemaType) => {
    const slots = form.getValues("slots");

    if (slots && slots?.length > 0) {
      // const checkSlot = slots?.find((item) => item.name === data.name);
      const checkSlot = false;
      if (checkSlot) {
        toast({
          title: "Error",
          description: "Court name is already exist",
          variant: "destructive",
        });
      } else {
        form.setValue("slots", [...slots, data]);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Slot has been added",
          className: "bg-green-600 text-white",
        });
        setIsDialogOpen(false);
      }
    } else {
      form.setValue("slots", [data]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Slot has been added",
        className: "bg-green-600 text-white",
      });
    }
  };
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const slotMaping = useMemo(() => {
    const data = form.watch("slots");
    const result: { [key: string]: SlotSchemaType[] } = {};
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
  }, [form.watch("slots")]);

  console.log(slotMaping, "slotMaping");

  const deleleteSlot = (
    weekDay: string,
    startTime: string,
    endTime: string
  ) => {
    const slots = form.getValues("slots");
    const newSlots = slots.filter(
      (slot) =>
        slot.weekDay !== weekDay ||
        slot.startTime !== startTime ||
        slot.endTime !== endTime
    );
    console.log(newSlots, "newSlots");

    form.setValue("slots", newSlots);
  };

  function generateAvailableTimeSlots(): SlotSchemaType[] {
    const { availableTime } = branchStep[6]?.data as { availableTime: string };
    const { SlotPeriod } = branchStep[6]?.data as { SlotPeriod: number };

    const slots: SlotSchemaType[] = [];
    const [startTime, endTime] = availableTime.split("-");
    const startHour = Number(startTime?.split(":")[0]);
    const startMinute = Number(startTime?.split(":")[1]);
    const endHour = Number(endTime?.split(":")[0]);
    const endMinute = Number(endTime?.split(":")[1]);

    for (
      let weekDay = WeekDayEnum.Monday;
      weekDay <= WeekDayEnum.Sunday;
      weekDay++
    ) {
      const currentTime = new Date();
      currentTime.setHours(startHour, startMinute, 0, 0);

      while (
        currentTime.getHours() * 60 + currentTime.getMinutes() <=
        endHour * 60 + endMinute
      ) {
        const slot: SlotSchemaType = {
          weekDay,
          startTime: `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`,
          endTime: `${(currentTime.getHours() + Math.floor((currentTime.getMinutes() + SlotPeriod) / 60)).toString().padStart(2, "0")}:${((currentTime.getMinutes() + SlotPeriod) % 60).toString().padStart(2, "0")}`,
          surcharge: 0, // You can set the surcharge value here
        };
        slots.push(slot);
        currentTime.setMinutes(currentTime.getMinutes() + SlotPeriod);
      }
    }

    return slots;
  }
  console.log(generateAvailableTimeSlots(), "generateAvailableTimeSlots");

  return (
    <div className="flex size-full flex-col gap-2 overflow-auto">
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
            WeekDay Slot Setup
          </h1>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must provide us with the general information about your branch. You
        can auto generate the slot period for your branch based on your previous
        setup.
        <div className="flex  items-center justify-end gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      description: "Start time must be a valid time",
                    },
                    endTime: {
                      fieldType: TimeFieldType,
                      // fieldType: TimePickerDemo,
                      description: "End time must be a valid time",
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
                      description: "Surcharge must be a positive number",
                    },
                  }}
                >
                  <AutoFormSubmit className="w-full">
                    <DialogFooter className="w-full">
                      <Button className="w-full" type="submit">
                        Save slot
                      </Button>
                    </DialogFooter>
                  </AutoFormSubmit>
                </AutoForm>
              </div>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="flex items-center gap-2">
                <ZapIcon /> Fast generate slots
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {form.watch("slots")?.length
                    ? "You can generate the slot based on your previous setup. This will override your current slots. Are you sure you want to continue?"
                    : "This feature needs at least one slot to generate the slot period. Please add at least one slot to continue."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {form.watch("slots")?.length && (
                  <AlertDialogAction onClick={generateSlot}>
                    Generate
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2  border-t p-2">
        <div className="flex w-full flex-col gap-2">
          {slotMaping &&
            Object.keys(slotMaping).map((key) => {
              return (
                <div key={key} className="flex w-full flex-col gap-2">
                  <span className="font-semibold">{key}</span>
                  <div className="grid  grid-cols-12 gap-2">
                    {slotMaping[key]?.map((slot) => {
                      return (
                        <Badge
                          key={slot.availableTime}
                          variant="secondary"
                          className="col-span-4 flex cursor-pointer items-center gap-1 py-2 transition-all duration-300 ease-in  hover:bg-gray-400"
                        >
                          <Hourglass className="text-sm" />
                          <span className="text-xs">{slot.availableTime}</span>
                          <Trash
                            onClick={() => {
                              deleleteSlot(key, slot.availableTime);
                            }}
                            className="bottom-1 right-1 z-30 ml-auto rounded-full bg-red-200 p-2 text-red-700 opacity-40 shadow-md transition-all duration-300 ease-in hover:scale-125 hover:opacity-100"
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Button
        type="submit"
        className="flex w-full select-none items-center justify-center gap-2 px-4"
        disabled={stepIndex === steppers.length}
        onClick={() => {
          validateForm();
          onSubmit(form.getValues());
        }}
      >
        Next <ChevronRight />
      </Button>
    </div>
  );
};

export default AvailableSlot;
