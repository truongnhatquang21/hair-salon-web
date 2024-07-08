"use server";

import type { ISchedule } from "@/interfaces/schedule.interface";
import type { CourtSchemaTypeWithId } from "@/views/courts/helper";

import { fetcher } from ".";

export const getCheckInApi = async (data: { id: string }) => {
  return fetcher<
    (ISchedule & {
      court: CourtSchemaTypeWithId;
    })[]
  >(`schedule/GetScheduleByBooking/${data.id}`);
};
export const checkInApi = async (data: { id: string }) => {
  return fetcher(`schedule/update/${data.id}`, {
    method: "POST",
  });
};
