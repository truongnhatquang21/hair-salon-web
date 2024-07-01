"use client";

import React, { useEffect, useState } from "react";

import { getMyBookingReceipt } from "@/app/api/auth/booking-receipt";
import BookingReceipt from "@/components/CustomerBooking/BookingReceipts";
import type IBookingReceipt from "@/types/BookingReceipt";

type Props = {};

const Receipt: React.FC<Props> = () => {
  const [bookings, setBookings] = useState<IBookingReceipt[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookingReceipt();
        console.log(data);
        setBookings(data?.bookingList);
      } catch (error) {
        console.error("Failed to fetch booking receipts:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <BookingReceipt bookings={bookings} />
    </div>
  );
};

export default Receipt;
