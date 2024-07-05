"use server";

import type { IBooking } from "@/interfaces/booking.interface";
import type { ISchedule } from "@/interfaces/schedule.interface";

import { fetcher } from "..";

export const getMyBookingReceipt = async () => {
  return fetcher("booking/MyBooking");
};
export const postBooking = async (data: {
  booking: Omit<IBooking, "status">;
  schedule: Omit<ISchedule, "status">;
}) => {
  return fetcher("booking", { method: "POST", body: JSON.stringify(data) });
};

export const getMyBookingReceiptByStatus = async (status: string = "") => {
  const endpoint = status
    ? `booking/GetBookingByStatus/${status}`
    : "booking/MyBooking";
  return fetcher(endpoint);
};
