"use server";

import { fetcher } from "..";

export const getMyBookingReceipt = async () => {
  return fetcher("booking/MyBooking");
};

export const getMyBookingReceiptByStatus = async (status: string = "") => {
  const endpoint = status
    ? `booking/GetBookingByStatus/${status}`
    : "booking/MyBooking";
  return fetcher(endpoint);
};
