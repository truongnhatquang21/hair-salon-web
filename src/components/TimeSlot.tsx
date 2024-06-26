"use client";

import { useState } from "react";

import { Button } from "./ui/button";

export const TimeSlot = () => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showSelectedSlots, setShowSelectedSlots] = useState(false);
  const timeSlots = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM",
  ];
  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
      setShowSelectedSlots(true);
    }
  };
  return (
    <div className="p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold">Book a Badminton Court</h2>
        <div className="grid grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlots.includes(slot) ? "default" : "outline"}
              className={`h-12 rounded-md px-4 ${
                selectedSlots.includes(slot)
                  ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => toggleSlot(slot)}
            >
              {slot}
            </Button>
          ))}
        </div>
        {/* {showSelectedSlots && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-bold">Selected Slots:</h3>
            <div className="grid grid-cols-4 gap-4">
              {selectedSlots.map((slot) => (
                <div
                  key={slot}
                  className="rounded-md bg-gray-900 px-4 py-2 text-white dark:bg-gray-50 dark:text-gray-900"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        )} */}
        <div className="mt-6 flex justify-end">
          <Button variant="default" className="rounded-md px-6 py-2">
            Book Selected Slots
          </Button>
        </div>
      </div>
    </div>
  );
};
