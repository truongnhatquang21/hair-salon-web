"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import { doneBookingAPI } from "@/apiCallers/booking";
import { getCheckInApi } from "@/apiCallers/checkIn";
import { Loading } from "@/components/loading";
import SpinnerIcon from "@/components/SpinnerIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleStatusEnum } from "@/types";

import CheckInBtn from "./CheckInBtn";

export function compareTimesInMilliseconds(
  time1: string,
  time2: string
): number {
  // Parse the time strings into Date objects
  const [hour1, minute1] = time1.split(":").map(Number);
  const [hour2, minute2] = time2.split(":").map(Number);

  const date1 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    hour1,
    minute1,
    0,
    0
  );
  const date2 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    hour2,
    minute2,
    0,
    0
  );

  // Calculate the difference in milliseconds
  return Math.abs(date1.getTime() - date2.getTime());
}

export function isCanCheckIn(playDay: string, startTime: string): boolean {
  // Parse the input parameters
  const playDayDate = new Date(playDay);
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const startDateTime = new Date(
    playDayDate.getFullYear(),
    playDayDate.getMonth(),
    playDayDate.getDate(),
    startHour,
    startMinute,
    0,
    0
  );

  // Calculate the check-in window (1 hour before and 1 hour after the start time)
  const checkInStartTime = new Date(startDateTime.getTime() - 60 * 60 * 1000);
  const checkInEndTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  // Get the current date and time
  const currentDateTime = new Date();

  // Check if the current date and time is within the check-in window
  return (
    currentDateTime >= checkInStartTime && currentDateTime <= checkInEndTime
  );
}

type Props = {
  slug: string;
};

const CheckinDetail = ({ slug }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["checkin", slug],
    queryFn: async () => {
      return getCheckInApi({ id: slug });
    },
  });
  const sortData = useMemo(() => {
    const sourceData = data?.data;
    if (sourceData?.length) {
      return sourceData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .sort((a, b) => compareTimesInMilliseconds(a.startTime, b.startTime))
        .sort((a, b) => compareTimesInMilliseconds(a.endTime, b.endTime));
    }
  }, [data?.data]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: doneBooking, isPending: isDoneBookingPending } =
    useMutation({
      mutationFn: async (id: string) => doneBookingAPI({ id }),
      onSuccess: (Res) => {
        if (!Res.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: Res.message || Res.statusText,
          });

          throw new Error(Res.message || Res.statusText);
        }
        queryClient.invalidateQueries(["checkin", slug]);
        if (Res.message) {
          return toast({
            variant: "default",
            className: "bg-green-600 text-white",
            title: "Message from system",
            description: Res.message,
          });
        }
        router.refresh();
        return toast({
          variant: "default",
          title: "Submitted successfully",
          description: "You can do something else now",
        });
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
        });
      },
    });

  const onDoneBooking = async () => {
    try {
      await doneBooking(slug);
    } catch (e) {
      console.error(e);
    }
  };
  console.log(data, "ADSf");

  return (
    <div className="size-full">
      {isLoading ? (
        <div className="flex size-full items-center justify-center">
          <Loading />
        </div>
      ) : !data?.data ? (
        "No data"
      ) : (
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Badminton Booking Schedule</h2>
            <p className="text-muted-foreground">
              Check in for your badminton booking.
            </p>
            <p className="text-muted-foreground">
              Please check in 1 hour before your booking time.
            </p>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-1 flex-col items-start gap-2 border-b-2 p-2">
                <Badge>{data?.data[0]?.booking?.status}</Badge>
                <div className="text-sm">{data?.data[0]?.booking?.type}</div>
                <div className="font-bold">
                  {data?.data[0]?.booking?.customer.email}
                </div>
                <div className="text-xs font-semibold  italic">
                  {format(
                    new Date(data?.data[0]?.booking?.startDate),
                    "dd/MM/yyyy"
                  )}
                  --
                  {format(
                    new Date(data?.data[0]?.booking?.endDate),
                    "dd/MM/yyyy"
                  )}
                </div>
              </div>
              {data?.data[0]?.booking?.status === "Booked" && (
                <Button
                  onClick={() => {
                    onDoneBooking();
                  }}
                  disabled={isDoneBookingPending}
                >
                  {isDoneBookingPending ? <SpinnerIcon /> : "Done this booking"}
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            {sortData?.map((item) => (
              <div
                key={item._id}
                className="relative flex items-center justify-between rounded-lg bg-muted p-4"
              >
                <Badge className="absolute -right-2 -top-2">
                  {item.status}
                </Badge>
                <div>
                  <div className="font-medium">
                    Branch: {item?.court?.branch?.name}
                  </div>
                  <div className="font-medium">Court: {item?.court?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.startTime} - {item.endTime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(item.date), "dd/MM/yyyy")}
                  </div>
                </div>
                {item.status === ScheduleStatusEnum.AVAILABLE &&
                  data?.data[0]?.booking?.status !== "Done" &&
                  (isCanCheckIn(item.date, item.startTime) ? (
                    <CheckInBtn
                      id={item._id}
                      invalidateKey={["checkin", slug]}
                    />
                  ) : (
                    <Button className="h-10 text-xs" variant="ghost" disabled>
                      No check in this time
                    </Button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinDetail;
