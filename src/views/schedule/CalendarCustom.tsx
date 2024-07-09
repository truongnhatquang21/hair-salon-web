"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import moment from "moment";
import { useCallback, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";

import { getScheduleOfCustomer } from "@/apiCallers/schedule";
import { Loading } from "@/components/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const localizer = momentLocalizer(moment);

const events = [
  {
    id: 0,
    title: "Board meeting",
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: "MS training",
    allDay: true,
    start: new Date(2024, 6, 29, 14, 0, 0),
    end: new Date(2024, 6, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: "Team lead meeting",
    start: new Date(2024, 6, 29, 8, 30, 0),
    end: new Date(2024, 6, 29, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 11,
    title: "Birthday Party",
    start: new Date(2024, 6, 30, 7, 0, 0),
    end: new Date(2024, 6, 30, 10, 30, 0),
    resourceId: 4,
  },
];

// const resourceMap = [
//   { resourceId: 1, resourceTitle: "Board room" },
//   { resourceId: 2, resourceTitle: "Training room" },
//   { resourceId: 3, resourceTitle: "Meeting room 1" },
//   { resourceId: 4, resourceTitle: "Meeting room 2" },
// ];f

export default function CustomCalendar() {
  const { data: scheduleCustomer, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      return getScheduleOfCustomer();
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const handleSelectEvent = useCallback((event) => {
    console.log(event);
    setOpen(true);
    setSelectedEvent(event);
  }, []);

  console.log("schedule: ", scheduleCustomer);
  const eventData =
    scheduleCustomer?.data.length == 0
      ? []
      : scheduleCustomer?.data.Available.map((el) => {
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
            ...el,
          };
        });
  return (
    <div className="h-[70vh]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loading />
        </div>
      ) : (
        <BigCalendar
          style={{ width: "100%" }}
          // selectable
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
