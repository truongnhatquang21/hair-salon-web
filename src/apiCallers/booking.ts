"use server";

import { fetcher } from ".";

export const doneBookingAPI = async (data: { id: string }) => {
  return fetcher(`booking/done/${data.id}`, {
    method: "PUT",
  });
};
