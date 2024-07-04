"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { getMyBookingReceiptByStatus } from "@/apiCallers/customerBooking";
import BookingReceipt from "@/components/CustomerBooking/BookingReceipts";
import StatusFilter from "@/components/CustomerBooking/StatusFilter";
import { EmptyComponent } from "@/components/Empty";

type Props = {};

const Receipt: React.FC<Props> = () => {
  const [status, setStatus] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookingReceipts", status],
    queryFn: async () =>
      getMyBookingReceiptByStatus(status === "All" ? "" : status),
  });

  const bookings = data?.data ?? [];

  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load data"}</div>;
  }

  return (
    <div>
      <div className="my-4 flex justify-end">
        <StatusFilter currentStatus={status} onStatusChange={setStatus} />
      </div>
      {bookings?.length > 0 ? (
        <BookingReceipt bookings={bookings} />
      ) : (
        <EmptyComponent
          title="No Booking History Found"
          description="You haven't made any bookings yet. Start booking now to manage your reservations."
          className="w-full"
        />
      )}
    </div>
  );
};

export default Receipt;
