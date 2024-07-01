import Image from "next/image";
import React from "react";

import type IBookingReceipt from "@/types/BookingReceipt";

import CustomTag from "../CustomTag";
import { Separator } from "../ui/separator";

type Props = {
  booking: IBookingReceipt;
};

const BookingCard: React.FC<Props> = ({ booking }) => {
  return (
    <>
      <div className="flex w-full justify-between align-middle">
        <div>
          <h2 className="w-full text-lg font-semibold">
            {booking.court.branch.name}
          </h2>
        </div>
        <div>
          <CustomTag status={booking.status} />
        </div>
      </div>
      <Separator className="my-2" />

      <div className="flex justify-between align-middle">
        <div>
          <CustomTag status={booking.type} />
        </div>
        <div>
          <span className="text-sm opacity-80">{`${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`}</span>
        </div>
      </div>
      <Separator className="my-2" />
      <div />
      <div className="flex justify-between align-middle">
        <div className="flex gap-3 align-middle">
          <div>
            <Image
              src={booking.court.images[0] ?? ""}
              alt={booking.court.name}
              className=""
              width={100}
              height={100}
            />
          </div>
          <div className="my-auto font-semibold">{booking.court.name}</div>
        </div>
        <div className="flex flex-col justify-end gap-3 align-middle">
          <div className="ml-auto">x {booking.totalHour}</div>
          <div className="ml-auto opacity-70">$ {booking.court.price}</div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <p className="flex gap-2">
          <span className="opacity-80">{booking.totalHour} hours</span>
        </p>
        <p className="flex gap-2">
          <strong>Total price:</strong>{" "}
          <div className="font-medium">
            <span className="text-red-500">${booking.totalPrice}</span>
          </div>
        </p>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between gap-2">
        <p className="flex gap-2">
          <strong>Payment method:</strong>{" "}
          <div>
            {booking.paymentMethod === "vnpay"
              ? "VNPay"
              : booking.paymentMethod}
          </div>
        </p>
        <p className="flex gap-2">
          <strong>Payment type:</strong>
          <div>{booking.paymentType}</div>
        </p>
      </div>
    </>
  );
};

export default BookingCard;
