import type IBookingReceipt from "@/types/BookingReceipt";

const baseUrl = process.env.SERVER_URL;
export const getMyBookingReceipt = async (): Promise<IBookingReceipt[]> => {
  const res = await fetch(`${baseUrl}booking/MyBooking`, {
    cache: "no-store",
  });
  const booking = await res.json();
  return booking;
};
