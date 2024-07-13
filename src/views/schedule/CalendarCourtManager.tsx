"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";

import { getCourtByBranchIdAPI } from "@/apiCallers/courts";
import { getScheduleByCourt } from "@/apiCallers/schedule";
import { Loading } from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchStore } from "@/stores/branchStore";
import { ScheduleStatusEnum } from "@/types";

import SetScheduleBtnManager from "./SetScheduleBtnManager";

const localizer = momentLocalizer(moment);
const EventSchedule = ({ event }) => {
  const backgroundColor =
    event.type === "Booking"
      ? event.status === ScheduleStatusEnum.AVAILABLE
        ? "#3174ad"
        : "green"
      : "orange";

  // Set a default color if none provided
  return <div style={{ backgroundColor, padding: 0 }}>{event.title}</div>;
};
export default function CalendarCourtManager() {
  const selectedBranch = useBranchStore((state) => state.branch);

  const [selectedCourt, setSelectedCourt] = useState("all");
  useEffect(() => {
    setSelectedCourt("all");
  }, [selectedBranch?._id]);
  const { data: CourtList } = useQuery({
    queryKey: ["myCourtList", (selectedBranch?._id as string) || ""],
    queryFn: async () => getCourtByBranchIdAPI(selectedBranch?._id as string),
  });

  useEffect(() => {
    if (CourtList?.data?.length) {
      setSelectedCourt(CourtList?.data[0]._id || "All");
    }
  }, [CourtList, selectedBranch]);
  const { data: scheduleCustomer, isLoading } = useQuery({
    queryKey: ["schedule", selectedCourt || ""],
    enabled: selectedCourt !== "all",
    queryFn: async () => {
      return getScheduleByCourt(selectedCourt);
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const handleSelectEvent = useCallback((event) => {
    setOpen(true);
    setSelectedEvent(event);
  }, []);

  const eventData =
    scheduleCustomer?.status === 500 || scheduleCustomer?.data.length === 0
      ? []
      : scheduleCustomer?.data.map((el) => {
          const calculateStart = () => {
            const parsedDate = new Date(el.date);

            parsedDate.setHours(...el.startTime.split(":").map(Number));

            return parsedDate;
          };
          const calculateEnd = () => {
            const parsedDate = new Date(el.date);

            parsedDate.setHours(...el.endTime.split(":").map(Number));

            return parsedDate;
          };
          const starTime = calculateStart();
          const endDate = calculateEnd();
          return {
            id: el._id,
            title: el.court.name,
            branch: el.court.branch.name,
            court: el.court.name,
            start: starTime,
            end: endDate,
            status: el.status,
            type: el.type,
            customerName: el?.booking?.customer?.email,
            ...el,
          };
        });

  return (
    <div className="h-[70vh]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Schedule{" "}
              <Badge
                className={clsx(
                  "px-2 py-1 text-sm font-medium",
                  selectedEvent?.type === "Booking"
                    ? "bg-green-700"
                    : "bg-orange-300"
                )}
              >
                {selectedEvent?.type}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {selectedEvent?.customerName && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 text-muted-foreground">Email:</div>
                <div className="col-span-3">{selectedEvent?.customerName}</div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1 text-muted-foreground">Date:</div>
              <div className="col-span-3">
                {selectedEvent && format(selectedEvent?.date, "yyyy-MM-dd")}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1 text-muted-foreground">Time:</div>
              <div className="col-span-3">
                {selectedEvent?.startTime} - {selectedEvent?.endTime}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1 text-muted-foreground">Branch:</div>
              <div className="col-span-3">{selectedEvent?.branch}</div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 text-muted-foreground">Court:</div>
              <div className="col-span-3">{selectedEvent?.title}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1 text-muted-foreground">Status:</div>
              <div className="col-span-3">{selectedEvent?.status}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-5  flex items-center justify-between">
        {selectedCourt === "all" ? (
          <div className="">
            <Button className="w-fit" disabled>
              Set Schedule
            </Button>
          </div>
        ) : (
          <SetScheduleBtnManager
            Trigger={
              <div className="max-w-[200px]">
                <Button className="w-fit">Set Schedule</Button>{" "}
              </div>
            }
            defalutValues={selectedCourt}
          />
        )}
        <div className="w-[200px]">
          <Select
            value={selectedCourt}
            onValueChange={(value) => setSelectedCourt(value)}
            defaultValue="all"
          >
            <SelectTrigger className="">
              <SelectValue
                className="p-2"
                placeholder={
                  selectedBranch
                    ? `Select court of ${selectedBranch?.name}`
                    : "Select court"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all" disabled>
                {selectedBranch
                  ? `All court of ${selectedBranch?.name}`
                  : "All court"}
              </SelectItem> */}
              {CourtList?.data?.map((court) => (
                <SelectItem key={court._id} value={court._id}>
                  {/* <Avatar>
                    <AvatarImage src={court.images[0]} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar> */}
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loading />
        </div>
      ) : (
        <BigCalendar
          style={{ width: "100%" }}
          // selectable
          // backgroundEvents={{ }}
          components={{ event: EventSchedule }}
          localizer={localizer}
          events={eventData}
          onSelectEvent={handleSelectEvent}
          defaultView={Views.MONTH}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={30}
          defaultDate={new Date()}
        />
      )}
    </div>
  );
}
