/* eslint-disable no-underscore-dangle */
import React from "react";

import { BookingStatusEnum } from "@/types";
import type IBookingReceipt from "@/types/BookingReceipt";

import { Button } from "../ui/button";
import BookingCard from "./BookingCard";
import CancelBookingBtn from "./CancelBookingBtn";

type Props = {
  bookings: IBookingReceipt[];
  invalidateKey?: string[];
};

function isWithin15MinutesOfCreatedTime(createdTime: Date): boolean {
  const now = new Date();
  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
  const maxCreatedTime = new Date(createdTime.getTime() + fifteenMinutes);
  return now <= maxCreatedTime;
}

const BookingReceipt: React.FC<Props> = ({ bookings, invalidateKey }) => {
  return (
    <div className="container my-10 flex-col items-center gap-5">
      <div className="flex w-full flex-wrap justify-between gap-3">
        {bookings?.map((booking) => {
          const orderDate: Date = new Date(booking.startDate);

          // Calculate the number of days since the order was placed
          const daysBeforeStart: number = Math.floor(
            (-Date.now() + orderDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={booking?._id}
              className="flex w-full flex-col gap-1 rounded-md border-2 border-dashed p-4"
            >
              <BookingCard booking={booking} invalidateKey={invalidateKey} />

              {booking.status === BookingStatusEnum.BOOKED &&
                (daysBeforeStart >= 2 ||
                isWithin15MinutesOfCreatedTime(new Date(booking.createdAt)) ? (
                  <CancelBookingBtn
                    invalidateKey={invalidateKey}
                    defalutValues={booking}
                    Trigger={
                      <Button className="flex w-full justify-center">
                        Cancel booking
                      </Button>
                    }
                  />
                ) : (
                  <div className="flex cursor-not-allowed flex-col items-center gap-2 rounded-md bg-gray-500 p-2 text-white shadow-md">
                    <span className="text-lg font-bold">
                      You can't cancel this booking
                    </span>
                    <span className="text-sm opacity-70">
                      You can only cancel bookings{" "}
                      <b className="text-xl font-bold">2</b> days before the
                      start date
                    </span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingReceipt;
