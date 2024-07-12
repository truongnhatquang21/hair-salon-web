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
  transaction: { amount: number; payment: string };
}) => {
  return fetcher("booking", { method: "POST", body: JSON.stringify(data) });
};
export const postBookingCompetition = async (data: {
  courtArray: string[];
  booking: Omit<IBooking, "status">;
  schedule: Omit<ISchedule, "status">;
  transaction: { amount: number; payment: string };
}) => {
  return fetcher("booking/competition", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const postBookingFlexible = async (data: {
  booking: Omit<IBooking, "status">;
  transaction: { amount: number; payment: string };
}) => {
  return fetcher("booking", { method: "POST", body: JSON.stringify(data) });
};
export const getMyBookingReceiptByStatus = async (status: string = "") => {
  const endpoint = status
    ? `booking/GetBookingByStatus/${status}`
    : "booking/MyBooking";
  return fetcher(endpoint);
};

export const cancelBookingAPI = async ({
  bookingId,
  paymentId,
}: {
  bookingId: string;
  paymentId: string;
}) => {
  return fetcher(`booking/cancel/${bookingId}`, {
    method: "POST",
    body: JSON.stringify({ paymentId }),
  });
};
