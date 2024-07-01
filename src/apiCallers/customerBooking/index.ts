"use server";

import { fetcher } from "..";

export const getMyBookingReceipt = async () => {
  return fetcher("/api/booking-receipt");
};
