/* eslint-disable no-underscore-dangle */
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as z from "zod";

import { setScheduleFlexible } from "@/apiCallers/schedule";
import { getSlotsOfCourt } from "@/apiCallers/slots";
import { Loading } from "@/components/loading";
import SpinnerIcon from "@/components/SpinnerIcon";
import { TimeSlot } from "@/components/TimeSlot";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  defalutValues: string;
  Trigger: React.ReactNode;
  invalidateKey?: string[];
};
export const datePicker = z.object({
  date: z.coerce.date(),
});
export type DatePickerType = z.infer<typeof datePicker>;

const SetScheduleBtnManager = ({
  defalutValues,
  Trigger,
  invalidateKey,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectDay, setSelectDay] = React.useState<Date | undefined>(
    new Date()
  );
  console.log(defalutValues);
  const [startSlot, setStartSlot] = React.useState(null);
  const [endSlot, setEndSlot] = React.useState(null);
  const [selectedSlots, setSelectedSlots] = React.useState<[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectType, setSelecType] = useState("Booking");
  const {
    mutateAsync: getSlotByCourtId,
    isPending: isSlotPending,
    data: SlotOfCourt,
  } = useMutation({
    mutationFn: async (dataReq: {
      date: Date | undefined;
      courtId: string | undefined;
    }) => {
      return getSlotsOfCourt(dataReq);
    },
    onSuccess: (dataRes) => {
      if (!dataRes.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: dataRes.message || dataRes.statusText,
        });
        throw new Error(dataRes.message || dataRes.statusText);
      }
    },
  });
  const {
    mutateAsync: setScheduleMutate,
    isPending: isSubmit,
    data: dataSchedule,
  } = useMutation({
    mutationFn: async (dataReq: {
      type: string;
      slots: string[];
      date: string;
      court: string;
      startTime: string;
      endTime: string;
      booking: string;
    }) => {
      return setScheduleFlexible(dataReq);
    },
    onSuccess: (dataRes) => {
      if (!dataRes.ok) {
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
          description: dataRes.message || dataRes.statusText,
        });
        throw new Error(dataRes.message || dataRes.statusText);
      }
    },
  });

  const handleSetScheduled = async () => {
    console.log({
      type: selectType,
      court: defalutValues,
      startTime: startSlot.startTime,
      endTime: endSlot ? endSlot.endTime : startSlot.endTime,
      date: format(selectDay.toString(), "yyyy-MM-dd"),
      slots: selectedSlots.map((el) => {
        return el._id;
      }),
    });
    await setScheduleMutate({
      type: selectType,
      court: defalutValues,
      startTime: startSlot.startTime,
      endTime: endSlot ? endSlot.endTime : startSlot.endTime,
      date: format(selectDay.toString(), "yyyy-MM-dd"),
      slots: selectedSlots.map((el) => {
        return el._id;
      }),
    });

    setIsOpen(false);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (defalutValues !== "" && selectDay) {
      getSlotByCourtId({
        courtId: defalutValues,
        date: format(selectDay?.toString(), "yyyy-MM-dd"),
      });
    }
  }, [defalutValues, getSlotByCourtId, selectDay]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-fit">{Trigger}</DialogTrigger>
        <DialogContent className="max-h-[70vh] overflow-auto sm:max-w-[70vw]">
          <DialogHeader>
            <DialogTitle>Set Schedule for your Court</DialogTitle>
            <DialogDescription>
              choose the date and time you want to play
            </DialogDescription>
          </DialogHeader>

          <div className=" flex w-full flex-col items-center justify-center gap-2 overflow-auto rounded-md border-2 border-dashed p-2 md:flex-row">
            <div className="flex flex-col gap-4">
              <Select
                value={selectType}
                onValueChange={(value) => setSelecType(value)}
                defaultValue="Booking"
              >
                <SelectTrigger
                  className={`${selectType === "Maintenance" && "bg-orange-300"} ${selectType === "Booking" && "bg-green-300"}`}
                >
                  <SelectValue className=" p-2" placeholder={selectType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={selectDay}
                fromDate={new Date()}
                onSelect={(value) => {
                  setSelectedSlots([]);

                  setSelectDay(value);
                }}
                className="rounded-md border"
              />
            </div>

            <span className="flex items-center  justify-between  py-2 font-semibold">
              <div className="flex min-h-full w-full flex-col gap-2">
                {isSlotPending ? (
                  <Loading />
                ) : (
                  <TimeSlot
                    title="choose a slot"
                    selectedSlots={selectedSlots}
                    setSelectedSlots={setSelectedSlots}
                    timeSlotData={SlotOfCourt?.data}
                    selectDay={selectDay}
                    endSlot={endSlot}
                    startSlot={startSlot}
                    setEndSlot={setEndSlot}
                    setStartSlot={setStartSlot}
                  />
                )}
              </div>
            </span>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setSelectedSlots([]);
                setSelectDay(new Date());
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex items-center justify-center"
              onClick={handleSetScheduled}
            >
              {isSubmit && <SpinnerIcon />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schedule Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              You can go to the schedule to view more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                console.log("lsđ");
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Go Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SetScheduleBtnManager;
