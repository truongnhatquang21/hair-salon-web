"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

import type { ISlot } from "@/interfaces/slot.interface";

import { Button } from "./ui/button";

export const TimeSlot = ({
  timeSlotData,
  setStartSlot,
  setEndSlot,
  startSlot,
  endSlot,
  setSelectedSlots,
  selectedSlots,
}: {
  timeSlotData: ISlot[];
  setStartSlot: Dispatch<SetStateAction<null>>;
  startSlot: string | null;
  endSlot: string | null;
  selectedSlots: string[] | null;
  setEndSlot: Dispatch<SetStateAction<null>>;
  setSelectedSlots: Dispatch<SetStateAction<string[]>>;
}) => {
  const [date, setDate] = useState(new Date());

  const timeSlots = useMemo(() => {
    const slots = [] as string[];
    // const timeSlotData = [
    //   {
    //     _id: "66819bee99b486f35b652aa6",
    //     weekDay: "Saturday",
    //     startTime: "11:00",
    //     endTime: "12:00",
    //     surcharge: 0,
    //     branch: "66819bee99b486f35b652a4e",
    //     __v: 0,
    //     createdAt: "2024-06-30T17:54:54.390Z",
    //     updatedAt: "2024-06-30T17:54:54.390Z",
    //   },
    //   {
    //     _id: "66819bee99b486f35b652aa7",
    //     weekDay: "Saturday",
    //     startTime: "12:00",
    //     endTime: "13:00",
    //     surcharge: 0,
    //     branch: "66819bee99b486f35b652a4e",
    //     __v: 0,
    //     createdAt: "2024-06-30T17:54:54.390Z",
    //     updatedAt: "2024-06-30T17:54:54.390Z",
    //   },
    //   {
    //     _id: "66819bee99b486f35b652aa8",
    //     weekDay: "Saturday",
    //     startTime: "13:00",
    //     endTime: "14:00",
    //     surcharge: 0,
    //     branch: "66819bee99b486f35b652a4e",
    //     __v: 0,
    //     createdAt: "2024-06-30T17:54:54.390Z",
    //     updatedAt: "2024-06-30T17:54:54.390Z",
    //   },
    // ];
    if (timeSlotData.length !== 0) {
      for (const slot of timeSlotData) {
        // const startTime = new Date(
        //   date.getFullYear(),
        //   date.getMonth(),
        //   date.getDate(),
        //   hour,
        //   minute
        // );
        // const endTime = new Date(
        //   date.getFullYear(),
        //   date.getMonth(),
        //   date.getDate(),
        //   hour + 1,
        //   minute
        // );

        const startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          parseInt(slot.startTime?.split(":")[0] ?? "0", 10),
          parseInt(slot.startTime?.split(":")[1] ?? "1", 10)
        );
        const endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          parseInt(slot.endTime?.split(":")[0] ?? "0", 10),
          parseInt(slot.endTime?.split(":")[1] ?? "1", 10)
        );
        const startTimeString = startTime
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .replace(/^0/, "");
        const endTimeString = endTime
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .replace(/^0/, "");
        slots.push(`${startTimeString} - ${endTimeString}`);
      }
      return slots;
    }
    return slots;
  }, [date, timeSlotData]);
  const toggleSlot = (slot) => {
    const slotIndex = timeSlots.indexOf(slot);
    if (!startSlot) {
      setStartSlot(slot);
      setSelectedSlots([slot]);
    } else if (!endSlot) {
      const startIndex = timeSlots.indexOf(startSlot);
      const endIndex = slotIndex;
      setEndSlot(slot);
      setSelectedSlots(
        timeSlots.slice(
          startIndex <= endIndex ? startIndex : endIndex,
          endIndex + 1
        )
      );
    } else if (slot === startSlot) {
      setStartSlot(null);
      setEndSlot(null);
      setSelectedSlots([]);
    } else {
      const startIndex = timeSlots.indexOf(startSlot);
      const endIndex = timeSlots.indexOf(slot);
      setEndSlot(slot);
      setSelectedSlots(
        timeSlots.slice(
          startIndex <= endIndex ? startIndex : endIndex,
          endIndex + 1
        )
      );
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold">Book a Badminton Court</h2>

        <div className="grid grid-cols-4 gap-4">
          {timeSlots.length !== 0 ? (
            timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={
                  selectedSlots.includes(slot)
                    ? "solid"
                    : startSlot === slot ||
                        (startSlot &&
                          endSlot &&
                          timeSlots.indexOf(slot) >=
                            (timeSlots.indexOf(startSlot) <=
                            timeSlots.indexOf(endSlot)
                              ? timeSlots.indexOf(startSlot)
                              : timeSlots.indexOf(endSlot)) &&
                          timeSlots.indexOf(slot) <=
                            (timeSlots.indexOf(startSlot) <=
                            timeSlots.indexOf(endSlot)
                              ? timeSlots.indexOf(endSlot)
                              : timeSlots.indexOf(startSlot)))
                      ? "outline"
                      : "ghost"
                }
                className={`h-12 rounded-md px-4 ${
                  selectedSlots.includes(slot)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : startSlot === slot ||
                        (startSlot &&
                          endSlot &&
                          timeSlots.indexOf(slot) >=
                            (timeSlots.indexOf(startSlot) <=
                            timeSlots.indexOf(endSlot)
                              ? timeSlots.indexOf(startSlot)
                              : timeSlots.indexOf(endSlot)) &&
                          timeSlots.indexOf(slot) <=
                            (timeSlots.indexOf(startSlot) <=
                            timeSlots.indexOf(endSlot)
                              ? timeSlots.indexOf(endSlot)
                              : timeSlots.indexOf(startSlot)))
                      ? "hover:bg-muted"
                      : "text-muted-foreground"
                }`}
                onClick={() => toggleSlot(slot)}
              >
                {slot}
              </Button>
            ))
          ) : (
            <div>empty</div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="default" className="rounded-md px-6 py-2">
            Book Selected Slots
          </Button>
        </div>
      </div>
    </div>
  );
};
