"use server";

import { fetcher } from "..";

export const getScheduleOfCustomer = async () => {
  return fetcher("schedule");
};
export const getScheduleByCourt = async (id: string | undefined) => {
  console.log("id: dsafđsffa ", id);
  return fetcher(`schedule/GetScheduleByCourt/${id}`);
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

export const setScheduleFlexible = async (data: {
  type: string;
  slots: string[];
  date: string;
  court: string;
  startTime: string;
  endTime: string;
  booking: string;
}) => {
  return fetcher("schedule/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
