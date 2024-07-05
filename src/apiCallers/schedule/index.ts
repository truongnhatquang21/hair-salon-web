"use server";

import { fetcher } from "..";

export const getScheduleOfCustomer = async () => {
  return fetcher("schedule");
};
