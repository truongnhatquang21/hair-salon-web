/* eslint-disable no-underscore-dangle */
import React from "react";

import type IBookingReceipt from "@/types/BookingReceipt";

import BookingCard from "./BookingCard";

type Props = {
  bookings: IBookingReceipt[];
};

const BookingReceipt: React.FC<Props> = ({ bookings }) => {
  return (
    <div className="container my-10 flex-col items-center gap-5">
      <div className="flex w-full flex-wrap justify-between gap-3">
        {bookings?.map((booking) => (
          <div
            key={booking._id}
            className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-4"
          >
            <BookingCard booking={booking} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingReceipt;
