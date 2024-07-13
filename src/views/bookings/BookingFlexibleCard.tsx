import Image from "next/image";
import React from "react";

import CustomTag from "@/components/CustomTag";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type IBookingReceipt from "@/types/BookingReceipt";
import { upperCaseFirstLetter } from "@/utils/Helpers";

import SetScheduleBtn from "../schedule/SetScheduleBtn";

type Props = {
  booking: IBookingReceipt;
  invalidateKey?: string[];
};

const BookingFlexibleCard: React.FC<Props> = ({ booking, invalidateKey }) => {
  return (
    <>
      <div className="flex w-full justify-between align-middle">
        <div>
          <h2 className="w-full text-lg font-semibold">
            {upperCaseFirstLetter(booking?.court?.branch?.name)}
          </h2>
        </div>
        <div>
          <CustomTag status={booking?.status} />
        </div>
      </div>
      <Separator className="my-2" />

      <div className="flex justify-between align-middle">
        <div>
          <CustomTag status={booking?.type} />
        </div>
        <div>
          <span className="text-sm opacity-80">{`${new Date(booking?.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`}</span>
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
          <div className="my-auto font-semibold">{booking?.court?.name}</div>
        </div>
        <div className="flex flex-col justify-end gap-3 align-middle">
          <div className="ml-auto">x {booking?.totalHour}</div>
          <div className="ml-auto opacity-70">$ {booking?.court?.price}</div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <p className="flex gap-2">
          <span className="opacity-80">
            <span className="text-xl font-bold">Total Hour:</span>{" "}
            {booking?.totalHour} hours
          </span>
        </p>
        <p className="flex gap-2">
          <strong>Total price:</strong>{" "}
          <div className="font-medium">
            <span className="text-red-500">${booking?.totalPrice}</span>
          </div>
        </p>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between gap-2">
        <p className="flex gap-2">
          {/* <strong>Payment method:</strong>{" "}
          <div>
            {booking?.paymentMethod === "vnpay"
              ? "VNPay"
              : booking?.paymentMethod}
          </div> */}
        </p>
        <p className="flex gap-2">
          {booking?.totalHour === 0 ? (
            <Button
              // variant=""
              disabled={booking?.totalHour === 0}
              className="flex w-full justify-center"
            >
              {booking?.totalHour === 0
                ? "Out of slots to book an appointment"
                : "Set Schedule"}
            </Button>
          ) : (
            <SetScheduleBtn
              invalidateKey={invalidateKey}
              defalutValues={booking}
              Trigger={
                <Button
                  // variant=""
                  disabled={booking?.totalHour === 0}
                  className="flex w-full justify-center"
                >
                  {booking?.totalHour === 0
                    ? "Out of slots to book an appointment"
                    : "Set Schedule"}
                </Button>
              }
            />
          )}
        </p>
      </div>
    </>
  );
};

export default BookingFlexibleCard;
