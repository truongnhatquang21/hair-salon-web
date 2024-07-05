import { fetcher } from "..";

export const getScheduleOfCustomer = async () => {
  return fetcher(`schedule/`, { method: "get" });
};
