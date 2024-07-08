"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import { getCheckInApi } from "@/apiCallers/checkIn";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
};

const CheckinDetail = ({ slug }: Props) => {
  const { data, isLoading, error } = useQuery({
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
        .sort((a, b) => a.startTime - b.startTime);
    }
  }, [data?.data]);

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
          {}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Badminton Booking Slots</h2>
            <p className="text-muted-foreground">
              Check available slots and book your badminton court.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 1</div>
                <div className="text-sm text-muted-foreground">
                  9:00 AM - 10:00 AM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 2</div>
                <div className="text-sm text-muted-foreground">
                  10:00 AM - 11:00 AM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 3</div>
                <div className="text-sm text-muted-foreground">
                  11:00 AM - 12:00 PM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 4</div>
                <div className="text-sm text-muted-foreground">
                  12:00 PM - 1:00 PM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 5</div>
                <div className="text-sm text-muted-foreground">
                  1:00 PM - 2:00 PM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Court 6</div>
                <div className="text-sm text-muted-foreground">
                  2:00 PM - 3:00 PM
                </div>
              </div>
              <Button variant="outline">Book</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinDetail;
