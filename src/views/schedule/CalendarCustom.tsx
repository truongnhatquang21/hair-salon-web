"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";

import { getScheduleOfCustomer } from "@/apiCallers/schedule";
import { Loading } from "@/components/loading";

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

const styles = {
  container: {
    width: "100%",
    height: "60vh",
    margin: "2em",
  },
};

export default function CustomCalendar() {
  const { data: scheduleCustomer, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      return getScheduleOfCustomer();
    },
  });
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
            start: starTime,
            end: endDate,
          };
        });
  return (
    <div className="h-[70vh]">
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
          defaultView={Views.MONTH}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={30}
          defaultDate={new Date()}
        />
      )}
    </div>
  );
}
