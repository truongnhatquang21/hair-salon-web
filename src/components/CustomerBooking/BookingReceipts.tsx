/* eslint-disable no-underscore-dangle */
import React from "react";

import { BookingStatusEnum } from "@/types";
import type IBookingReceipt from "@/types/BookingReceipt";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import BookingCard from "./BookingCard";
import CancelBookingBtn from "./CancelBookingBtn";

type Props = {
  bookings: IBookingReceipt[];
  invalidateKey?: string[];
};

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
              className="flex w-full flex-col gap-1 rounded-md border-2 border-gray-200 p-4 shadow-md"
            >
              <BookingCard booking={booking} invalidateKey={invalidateKey} />
              <Separator className="my-2" />
              {booking.status === BookingStatusEnum.BOOKED &&
                (daysBeforeStart >= 2 ? (
                  <div className="ml-auto">
                    <CancelBookingBtn
                      invalidateKey={invalidateKey}
                      defalutValues={booking}
                      Trigger={
                        <Button className="ml-auto">Cancel booking</Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="flex cursor-not-allowed flex-col items-center gap-2 rounded-md p-2 text-gray-500">
                    <span className="text-sm">
                      You can't cancel this booking. Because the booking can
                      only be canceled <b className="font-bold">2</b> days
                      before the start date
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
