"use server";

import type { ISchedule } from "@/interfaces/schedule.interface";

import { fetcher } from ".";

export const getCheckInApi = async (data: { id: string }) => {
  return fetcher<ISchedule[]>(`schedule/GetScheduleByBooking/${data.id}`);
};
