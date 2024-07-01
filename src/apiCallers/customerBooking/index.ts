"use server";

import { fetcher } from "..";

export const getMyBookingReceipt = async () => {
  return fetcher("booking/MyBooking");
};
