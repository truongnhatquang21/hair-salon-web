"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getMyBookingReceipt } from "@/apiCallers/customerBooking";
import BookingReceipt from "@/components/CustomerBooking/BookingReceipts";

type Props = {};

const Receipt: React.FC<Props> = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookingReceipts"],
    queryFn: async () => getMyBookingReceipt(),
  });

  const bookings = data?.bookingList ?? [];

  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load data"}</div>;
  }

  return (
    <div>
      <BookingReceipt bookings={bookings} />
    </div>
  );
};

export default Receipt;
