import { format } from "date-fns";
import Image from "next/image";
import React from "react";

import type IBookingReceipt from "@/types/BookingReceipt";

import CustomTag from "../CustomTag";
import { Separator } from "../ui/separator";

type Props = {
  booking: IBookingReceipt;
  invalidateKey?: string[];
};

const BookingCard: React.FC<Props> = ({ booking, invalidateKey }) => {
  return (
    <>
      <div className="flex w-full justify-between align-middle">
        <div>
          <div className="flex w-full gap-3">
            <h2 className="text-lg font-semibold">
              {booking?.court?.branch?.name}
            </h2>
            <div>
              <CustomTag status={booking?.type} />
            </div>
          </div>
          <div className="ml-auto flex w-full">
            <div className="flex w-full justify-between gap-2">
              <div>
                <span className="font-bold">Play schedule: </span>
                <span className="text-sm opacity-80">{`${format(booking?.startDate, "dd/MM/yyyy")} - ${format(booking?.endDate, "dd/MM/yyyy")}`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col align-bottom">
          <div className="flex justify-end">
            <CustomTag status={booking?.status} />
          </div>
          <div>
            <span className="font-bold">Booked at: </span>
            <span className="text-sm opacity-80">{`${format(booking?.createdAt, "dd/MM/yyyy")}`}</span>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div />
      <div className="flex justify-between align-middle">
        <div className="flex gap-3 align-middle">
          <div>
            <Image
              src={booking?.court?.images[0] ?? ""}
              alt={booking?.court?.name}
              className=""
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-semibold">{booking?.court?.name}</div>
            <div className="flex flex-col justify-end gap-3 align-middle">
              <div className="ml-auto">x {booking?.totalHour} hours</div>
            </div>
          </div>
        </div>
        <div className="my-auto ml-auto opacity-70">
          $ {booking?.court?.price}
        </div>
      </div>
      <Separator className="my-2" />
      <p className="ml-auto flex gap-2">
        <strong>Total price:</strong>{" "}
        <div className="font-medium">
          <span className="text-red-500">${booking?.totalPrice}</span>
        </div>
      </p>

      <div className="flex justify-end gap-2">
        <span className="font-bold">Payment: </span>
        <span>
          Pay <span className="font-semibold">{booking?.paymentType}</span> by{" "}
          <span className="font-semibold">{booking?.paymentMethod}</span>
        </span>
      </div>
    </>
  );
};

export default BookingCard;
