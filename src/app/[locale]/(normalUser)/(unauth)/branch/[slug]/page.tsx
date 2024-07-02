/* eslint-disable no-underscore-dangle */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DollarSignIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { getBranchByIdAPI } from "@/apiCallers/Branches";
import { postBooking } from "@/apiCallers/customerBooking";
import BranchDetailOverview from "@/components/branchs/BranchDetailOverview";
import CalendarDaily from "@/components/Custom/DailyCalendar";
import { Icons } from "@/components/icons";
import { Loading } from "@/components/loading";
import SpinnerIcon from "@/components/SpinnerIcon";
import { TimeSlot } from "@/components/TimeSlot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { IBooking } from "@/interfaces/booking.interface";
import type { ICourt } from "@/interfaces/court.interface";
import type { ISchedule } from "@/interfaces/schedule.interface";
import type { ISlot } from "@/interfaces/slot.interface";
import { getThu } from "@/utils/Helpers";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [selectDay, setSelectDay] = useState<Date | undefined>(new Date());
  const [startSlot, setStartSlot] = useState(null);
  const [endSlot, setEndSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState<ICourt | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brachDetail"],
    queryFn: async () => getBranchByIdAPI(slug),
  });

  const handleCourtSelection = (court: ICourt) => {
    if (selectedCourt?._id === court._id) {
      setSelectedCourt(null);
    } else {
      setSelectedCourt(court);
    }
  };
  const { mutateAsync: bookingMutation, isPending: bookingMutating } =
    useMutation({
      mutationFn: async (bookingData: {
        booking: Omit<IBooking, "status">;
        schedule: Omit<ISchedule, "status">;
      }) => postBooking(bookingData),
      onSuccess: (data) => {
        console.log(data);

        if (data.ok && !data.ok) {
          if (data.error) {
            // const errs = data.error as { [key: string]: { message: string } };
            // Object.entries(errs).forEach(([key, value]) => {
            //   setError(key as keyof PackageCourtSchemaType, {
            //     type: "manual",
            //     message: value.message,
            //   });
            // });
            console.log(data.error);
          }

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.message || data.statusText,
          });

          throw new Error(data.message || data.statusText);
        }

        if (data.message) {
          return toast({
            variant: "default",
            className: "bg-green-600 text-white",
            title: "Message from system",
            description: data.message,
          });
        }

        return toast({
          variant: "default",
          title: "Submitted successfully",
          description: "You can do something else now",
        });
      },
    });

  const handleBooking = async () => {
    console.log(selectDay);
    await bookingMutation({
      booking: {
        type: "single_schedule",
        paymentType: "haft",
        paymentMethod: "vnpay",
        totalPrice: 123,
        totalHour: 5,
        startDate: format(selectDay.toString(), "yyyy-MM-dd"),
        endDate: format(selectDay.toString(), "yyyy-MM-dd"),
        court: selectedCourt?._id as string,
      },
      schedule: {
        type: "booking",
        slots: selectedSlots.map((el) => el._id),
        startTime: startSlot.startTime,
        endTime: endSlot.endTime,
        date: format(selectDay.toString(), "yyyy-MM-dd"),
        court: selectedCourt?._id as string,
      },
    });
  };
  const timeSlots = useMemo(() => {
    const slotArray = data?.data?.slots?.filter((el: ISlot) =>
      el.weekDay.includes(getThu(selectDay))
    );
    return slotArray;
  }, [data?.data?.slots, selectDay]);
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh_-_56px)]  items-center justify-center p-5">
        <Loading />
      </div>
    );
  }

  if (isError || !data?.data) {
    router.push("/");
    return <div>Uh oh! Something went wrong.</div>;
  }
  return (
    <div className="min-h-[calc(100vh_-_56px)] p-5">
      <div className=" rounded-xl bg-slate-400 p-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex align-middle">
            <Image
              src="/assets/images/clerk.png"
              alt="Main Image"
              width={100}
              height={100}
              className="h-auto w-full cursor-pointer object-contain p-3"
            />
          </div>
          <div className="flex flex-col space-y-2 ">
            <Image
              src="/assets/images/banner.jpeg"
              alt="Secondary Image"
              width={100}
              height={100}
              className="max-h-96 w-full cursor-pointer"
            />
            <div className="relative">
              <Image
                src="/assets/images/clerk.png"
                alt="Tertiary Image"
                className=" w-full p-3 "
                width={100}
                height={100}
              />
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-50">
                <span className="text-2xl text-white">+ 6 ...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList className="flex border-b border-gray-200 dark:border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            {/* <TabsTrigger value="map">Map</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="py-4">
            <BranchDetailOverview data={data} />
          </TabsContent>
          <TabsContent value="schedules" className="py-4">
            <div>
              <CalendarDaily
                setSelectedSlots={setSelectedSlots}
                setDay={setSelectDay}
              />
              <TimeSlot
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                timeSlotData={timeSlots}
                endSlot={endSlot}
                startSlot={startSlot}
                setEndSlot={setEndSlot}
                setStartSlot={setStartSlot}
              />

              {selectedSlots.length !== 0 && (
                <div className="mx-auto mt-6 max-w-2xl">
                  <h3 className="mb-2 text-lg font-bold">
                    Select Badminton Court
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {data?.data?.courts.map((court: ICourt) => (
                      <Card
                        key={court._id}
                        className={`cursor-pointer ${
                          selectedCourt !== null &&
                          selectedCourt._id === court._id
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleCourtSelection(court)}
                      >
                        <CardContent className="grid gap-4 overflow-hidden p-5">
                          <div className="flex items-center gap-4">
                            <div
                              className={`cursor-pointer rounded-lg object-cover p-2 ${
                                selectedCourt !== null &&
                                selectedCourt._id === court._id
                                  ? " bg-slate-500 stroke-white "
                                  : " border-white text-white "
                              }`}
                            >
                              <Icons.BadmintonCourt className="rounded-lg object-cover" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{court.name}</h3>
                              <span
                                className={`text-sm ${
                                  selectedCourt !== null &&
                                  selectedCourt._id === court._id
                                    ? " text-slate-300 dark:text-slate-200 "
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {court.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Badge
                                variant="default"
                                className="bg-yellow-500 text-white"
                              >
                                Pending
                              </Badge>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                selectedCourt !== null &&
                                selectedCourt._id === court._id
                                  ? " text-slate-300 dark:text-slate-200 "
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              <UsersIcon className="size-4" />
                              <span>type: {court.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                selectedCourt !== null &&
                                selectedCourt._id === court._id
                                  ? " text-slate-300 dark:text-slate-200 "
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              <DollarSignIcon className="size-4" />
                              <span>{court.price}/hr</span>
                            </div>
                            {/* <Button variant="outline" size="sm">
                        Book Now
                      </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="default"
                      className="rounded-md px-6 py-2"
                      disabled={selectedCourt == null}
                      onClick={handleBooking}
                    >
                      {bookingMutating && <SpinnerIcon />}
                      Book Selected courts
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
