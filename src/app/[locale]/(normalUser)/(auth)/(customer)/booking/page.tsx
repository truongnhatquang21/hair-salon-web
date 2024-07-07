"use client";

import React from "react";

import { BookingDataStoreProvider } from "@/stores/bookingStore";
import ConfirmBooking from "@/views/bookings/ConfirmBooking";

const page = () => {
  return (
    <BookingDataStoreProvider>
      <div className="mx-auto max-w-6xl p-6 sm:p-8">
        <ConfirmBooking />
      </div>
    </BookingDataStoreProvider>
  );
};

export default page;
