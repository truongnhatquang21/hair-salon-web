"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

import { getThu } from "@/utils/Helpers";

import { Button } from "../ui/button";

interface CalendarDailyProps {
  setDay: Dispatch<SetStateAction<Date | undefined>>;
  setSelectedSlots: Dispatch<SetStateAction<[]>>;
}

export default function CalendarDaily({
  setDay,
  setSelectedSlots,
}: CalendarDailyProps) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(0);
  const daysInWeek = 7;
  // const startDay = new Date().getDate() - new Date().getDay();
  const days = Array.from(
    { length: daysInWeek },
    (_, i) =>
      new Date(
        new Date().getTime() +
          (i + currentWeek * daysInWeek) * 24 * 60 * 60 * 1000
      )
  );
  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
    setSelectedDay(new Date(selectedDay.getTime() - 7 * 24 * 60 * 60 * 1000));
  };
  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
    setSelectedDay(new Date(selectedDay.getTime() + 7 * 24 * 60 * 60 * 1000));
  };
  const handleDaySelect = (day: Date): void => {
    setSelectedSlots([]);
    setSelectedDay(day);
    setDay(day);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {days.map((day) => (
          <Button
            key={day.getDate()}
            variant={
              day.getDate() === selectedDay.getDate() &&
              day.getMonth() === selectedDay.getMonth()
                ? "default"
                : "ghost"
            }
            size="lg"
            className={`flex h-10 w-24 items-center justify-center rounded-full  ${
              day.getDate() === selectedDay.getDate() &&
              day.getMonth() === selectedDay.getMonth()
                ? " bg-primary text-primary-foreground"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => handleDaySelect(day)}
            disabled={day.getTime() < new Date().getTime()}
          >
            <div className="flex flex-col items-center ">
              <span>
                {`${day.getDate()} - ${day.toLocaleString("default", {
                  month: "short",
                })}`}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                {getThu(day)}
              </span>
            </div>
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePreviousWeek}
          disabled={
            currentWeek === 0 && days[0].getTime() <= new Date().getTime()
          }
        >
          Previous Week
        </Button>
        <Button variant="outline" onClick={handleNextWeek}>
          Next Week
        </Button>
      </div>
    </div>
  );
}
