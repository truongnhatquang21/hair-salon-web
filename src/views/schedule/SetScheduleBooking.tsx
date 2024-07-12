"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getMyBookingReceiptByStatus } from "@/apiCallers/customerBooking";
import { EmptyComponent } from "@/components/Empty";
import { Loading } from "@/components/loading";

import BookingFlexibleCard from "../bookings/BookingFlexibleCard";

export default function SetScheduleBooking() {
  const [status, setStatus] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookingReceipts", status],
    queryFn: async () =>
      getMyBookingReceiptByStatus(status === "All" ? "" : status),
  });

  const bookings = data?.data ?? [];

  console.log(bookings);
  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to load data"}</div>;
  }

  return (
    <div className="container my-10 flex-col items-center gap-5">
      <div className="flex w-full flex-wrap justify-between gap-3">
        {bookings?.filter((ek) => ek.type === "flexible_schedule").length >
        0 ? (
          bookings?.map((booking) => {
            if (booking?.type === "flexible_schedule") {
              return (
                <div
                  key={booking?._id}
                  className="flex w-full flex-col gap-1 rounded-md border-2 border-dashed p-4"
                >
                  <BookingFlexibleCard
                    booking={booking}
                    invalidateKey={["bookingReceipts", status]}
                  />
                </div>
              );
            }
          })
        ) : (
          <EmptyComponent
            title="No Booking flexible is Found"
            description="You haven't made any bookings flexible yet. Start booking now."
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
