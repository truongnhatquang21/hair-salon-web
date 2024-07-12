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
  title = "Book a Badminton Court",
}: {
  timeSlotData: ISlot[];
  setStartSlot: Dispatch<SetStateAction<null>>;
  startSlot: string | null;
  endSlot: string | null;
  selectedSlots: string[] | null;
  title: string;
  setEndSlot: Dispatch<SetStateAction<null>>;
  setSelectedSlots: Dispatch<SetStateAction<[]>>;
}) => {
  const [date, setDate] = useState(new Date());

  const timeSlots = useMemo(() => {
    const slots = [] as any[];

    if (timeSlotData.length !== 0) {
      for (const slot of timeSlotData) {
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

        slots.push({
          ...slot,
          isInThePass: endTime < new Date(),
          timeDisplay: `${startTimeString} - ${endTimeString}`,
        });
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
  console.log(timeSlots);
  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold">{title}</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {timeSlots.length !== 0 ? (
            timeSlots.map((slot) => (
              <Button
                disabled={slot.isInThePass}
                key={slot.timeDisplay}
                variant={
                  selectedSlots.includes(slot)
                    ? "default"
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
                {slot.timeDisplay}
              </Button>
            ))
          ) : (
            <div>empty</div>
          )}
        </div>
      </div>
    </div>
  );
};
