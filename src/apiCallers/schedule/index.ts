"use server";

import { fetcher } from "..";

export const getScheduleOfCustomer = async () => {
  return fetcher("schedule");
};

export const getDayOfPermanent = async (data: {
  startDate: string;
  endDate: string;
}) => {
  return fetcher("schedule/permanent", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
