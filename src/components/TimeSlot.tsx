"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar, CalendarDaysIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "./ui/button";

export const TimeSlot = () => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showSelectedSlots, setShowSelectedSlots] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startSlot, setStartSlot] = useState(null);
  const [endSlot, setEndSlot] = useState(null);
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 6;
    const endHour = 22;
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour,
          minute
        );
        const endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour + 1,
          minute
        );
        const startTimeString = startTime
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .replace(/^0/, "");
        const endTimeString = endTime
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .replace(/^0/, "");
        slots.push(`${startTimeString} - ${endTimeString}`);
      }
    }
    return slots;
  }, [date]);
  const toggleSlot = (slot) => {
    const slotIndex = timeSlots.indexOf(slot);
    if (!startSlot) {
      setStartSlot(slot);
      setSelectedSlots([slot]);
      setShowSelectedSlots(true);
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
      setShowSelectedSlots(false);
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
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setStartSlot(null);
    setEndSlot(null);
    setSelectedSlots([]);
    setShowSelectedSlots(false);
  };
  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold">Book a Badminton Court</h2>
        <div className="mb-6 flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDaysIcon className="size-4" />
                <span>Select Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                value={date}
                onValueChange={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
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
          ))}
        </div>
        {showSelectedSlots && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-bold">Selected Slots:</h3>
            <div className="grid grid-cols-4 gap-4">
              {selectedSlots.map((slot) => (
                <div
                  key={slot}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button variant="default" className="rounded-md px-6 py-2">
            Book Selected Slots
          </Button>
        </div>
      </div>
    </div>
  );
};
