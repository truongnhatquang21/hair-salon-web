/* eslint-disable no-underscore-dangle */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Info, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getProfileAPI } from "@/apiCallers/auth";
import { getBranchByIdAPI2 } from "@/apiCallers/Branches";
import { getCourtAvailable } from "@/apiCallers/courts";
import BranchDetailOverview from "@/components/branchs/BranchDetailOverview";
import CalendarDaily from "@/components/Custom/DailyCalendar";
import CustomTag from "@/components/CustomTag";
import { EmptyComponent } from "@/components/Empty";
import { Icons } from "@/components/icons";
import { Loading } from "@/components/loading";
import { TimeSlot } from "@/components/TimeSlot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import type { ICourt } from "@/interfaces/court.interface";
import type { ISlot } from "@/interfaces/slot.interface";
import { useBookingStore } from "@/stores/bookingStore";
import { RoleEnum } from "@/types";
import {
  calculateTotalPrice,
  calculateTotalPricePerCourt,
  getThu,
} from "@/utils/Helpers";

import FlexibleBooking from "./FlexibleBooking";

const BranchDetailCustomer = ({ slug }: { slug: string }) => {
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });
  const router = useRouter();
  const { toast } = useToast();
  const { setBooking } = useBookingStore((state) => {
    return {
      setBooking: state.setBookingData,
    };
  });

  const [selectDay, setSelectDay] = useState<Date | undefined>(new Date());
  const [startSlot, setStartSlot] = useState(null);
  const [endSlot, setEndSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState<[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<[]>([]);
  const handleCheckboxChange = (court: ICourt) => {
    if (selectedCourts.includes(court)) {
      setSelectedCourts(selectedCourts.filter((el) => el._id !== court._id));
    } else {
      setSelectedCourts([...selectedCourts, court]);
    }
  };
  console.log(selectedCourts);
  const [selectedCourt, setSelectedCourt] = useState<ICourt | null>(null);
  const [activeTab, setActiveTab] = useState("single_schedule");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brachDetail"],
    queryFn: async () => getBranchByIdAPI2(slug),
  });

  const {
    mutateAsync: getCourtAvalableMutatue,
    data: CourtData,
    isPending: isCourtPending,
  } = useMutation({
    mutationFn: async (data: {
      slots: string[];
      date: string | undefined;
      branch: string;
    }) => {
      return getCourtAvailable(data);
    },
    onSuccess: (dataRes) => {
      if (!dataRes.ok) {
        // if (data.error) {
        //   const errs = data.error as { [key: string]: { message: string } };
        //   Object.entries(errs).forEach(([key, value]) => {
        //     setError(key as keyof PackageCourtSchemaType, {
        //       type: "manual",
        //       message: value.message,
        //     });
        //   });
        // }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: dataRes.message || dataRes.statusText,
        });
        throw new Error(dataRes.message || dataRes.statusText);
      }
    },
  });
  console.log(CourtData?.data);
  const handleCourtSelection = (court: ICourt) => {
    if (selectedCourt?._id === court._id) {
      setSelectedCourt(null);
    } else {
      setSelectedCourt(court);
    }
  };

  const handleBooking = async () => {
    if (selectedCourt !== null || selectedCourts.length !== 0) {
      console.log(activeTab);
      if (activeTab === "competition_schedule") {
        setBooking({
          booking: {
            type: activeTab,
            paymentType: "haft",
            paymentMethod: "vnpay",
            totalPrice: calculateTotalPricePerCourt(
              selectedSlots,
              selectedCourts
            ),
            totalHour: selectedSlots.length,
            startDate: format(selectDay.toString(), "yyyy-MM-dd"),
            endDate: format(selectDay.toString(), "yyyy-MM-dd"),
            court: selectedCourts,
            arrayCourt: selectedCourts,
          },
          schedule: {
            type: "booking",
            slots: selectedSlots.map((el) => el._id),
            startTime: startSlot.startTime,
            endTime: endSlot ? endSlot.endTime : startSlot.endTime,
            date: format(selectDay.toString(), "yyyy-MM-dd"),
            court: selectedCourts,
          },
        });
        router.push("/booking");
      }
      if (
        activeTab === "single_schedule" ||
        activeTab === "permanent_schedule"
      ) {
        setBooking({
          booking: {
            type: activeTab,
            paymentType: "haft",
            paymentMethod: "vnpay",
            totalPrice: calculateTotalPrice(selectedSlots, selectedCourt.price),
            totalHour: selectedSlots.length,
            startDate: format(selectDay.toString(), "yyyy-MM-dd"),
            endDate: format(selectDay.toString(), "yyyy-MM-dd"),
            court: selectedCourt,
          },
          schedule: {
            type: "booking",
            slots: selectedSlots.map((el) => el._id),
            startTime: startSlot.startTime,
            endTime: endSlot ? endSlot.endTime : startSlot.endTime,
            date: format(selectDay.toString(), "yyyy-MM-dd"),
            court: selectedCourt,
          },
        });
        router.push("/booking");
      }
    }
  };
  const timeSlots = useMemo(() => {
    const slotArray = data?.data?.slots?.filter((el: ISlot) =>
      el.weekDay.includes(getThu(selectDay))
    );
    return slotArray;
  }, [data?.data?.slots, selectDay]);

  useEffect(() => {
    if (selectedSlots.length !== 0) {
      getCourtAvalableMutatue({
        branch: slug,
        slots: selectedSlots.map((el) => el._id),
        date: format(selectDay?.toString(), "yyyy-MM-dd"),
      });
    }
  }, [getCourtAvalableMutatue, selectDay, selectedSlots, slug]);

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
  // console.log(profileData);
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
            {profileData.data &&
              profileData?.data?.role === RoleEnum.CUSTOMER && (
                <TabsTrigger value="schedules">Schedules</TabsTrigger>
              )}

            {/* <TabsTrigger value="map">Map</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="py-4">
            <BranchDetailOverview data={data} />
          </TabsContent>
          <TabsContent value="schedules" className="py-4">
            <div>
              <Tabs
                defaultValue="single_schedule"
                value={activeTab}
                onValueChange={(value) => {
                  setSelectedSlots([]);
                  setStartSlot(null);
                  setEndSlot(null);
                  setActiveTab(value);
                }}
              >
                <div className="flex items-center justify-end gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={18} className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>permanent là gì</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TabsList className="flex w-fit  border-b border-gray-200 dark:border-gray-800">
                    <TabsTrigger value="single_schedule">Single</TabsTrigger>
                    <TabsTrigger value="permanent_schedule">
                      Permanent
                    </TabsTrigger>
                    <TabsTrigger value="flexible_schedule">
                      Flexible
                    </TabsTrigger>
                    <TabsTrigger value="competition_schedule">
                      Competition
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="permanent_schedule" className="py-4">
                  <Card className="p-5">
                    <CardTitle>Permanent Booking</CardTitle>
                    <CardDescription>
                      Secure your court for a recurring schedule. Great for
                      regular players.
                    </CardDescription>
                    <CardContent className="mt-5">
                      {" "}
                      <CalendarDaily
                        setSelectedCourts={setSelectedCourts}
                        setSelectedSlots={setSelectedSlots}
                        setDay={setSelectDay}
                        setEndSlot={setEndSlot}
                        setStartSlot={setStartSlot}
                      />
                      <TimeSlot
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        timeSlotData={timeSlots}
                        selectDay={selectDay}
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
                          {CourtData?.data?.length === 0 ? (
                            <EmptyComponent
                              title="No Court Available"
                              // description="You haven't made any bookings yet. Start booking now to manage your reservations."
                              className="w-full"
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              {CourtData?.data?.map((value: ICourt) => (
                                <Card
                                  key={value._id}
                                  className={`cursor-pointer ${
                                    selectedCourt !== null &&
                                    selectedCourt._id === value._id
                                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                      : "hover:bg-muted"
                                  }`}
                                  onClick={() => handleCourtSelection(value)}
                                >
                                  <CardContent className="grid gap-4 overflow-hidden p-5">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`cursor-pointer rounded-lg object-cover p-2 ${
                                          selectedCourt !== null &&
                                          selectedCourt._id === value._id
                                            ? " bg-slate-500 stroke-white "
                                            : " border-white text-white "
                                        }`}
                                      >
                                        <Icons.BadmintonCourt className="rounded-lg object-cover" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          {value.name}
                                        </h3>
                                        <span
                                          className={`line-clamp-3 text-sm ${
                                            selectedCourt !== null &&
                                            selectedCourt._id === value._id
                                              ? " text-slate-300 dark:text-slate-200 "
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        >
                                          {value.description}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CustomTag status={value.status} />
                                      </div>
                                      <div
                                        className={`flex items-center gap-2 text-sm ${
                                          selectedCourt !== null &&
                                          selectedCourt._id === value._id
                                            ? " text-slate-300 dark:text-slate-200 "
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        <UsersIcon className="size-4" />
                                        <span>type: {value.type}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`flex items-center gap-2 text-sm ${
                                          selectedCourt !== null &&
                                          selectedCourt._id === value._id
                                            ? " text-slate-300 dark:text-slate-200 "
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        {/* <DollarSignIcon className="size-4" /> */}
                                        <span>
                                          {(value.price / 100).toFixed(2)}
                                          VND/slot
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="default"
                              className="rounded-md px-6 py-2"
                              disabled={selectedCourt == null}
                              onClick={handleBooking}
                            >
                              {/* {bookingMutating && <SpinnerIcon />} */}
                              Book Selected courts
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="flexible_schedule" className="py-4">
                  <Card className="p-5">
                    <CardTitle>Flexible Booking</CardTitle>
                    <CardDescription>
                      Book a court with the option to reschedule. Great for busy
                      schedules.
                    </CardDescription>
                    <CardContent className="mt-5">
                      <FlexibleBooking
                        setSelectedCourts={setSelectedCourts}
                        courts={data.data.courts}
                        handleCourtSelection={handleCourtSelection}
                        selectedCourt={selectedCourt}
                        selectDay={selectDay}
                        setSelectDay={setSelectDay}
                        setSelectedSlots={setSelectedSlots}
                        selectedSlots={selectedSlots}
                        endSlot={endSlot}
                        startSlot={startSlot}
                        setEndSlot={setEndSlot}
                        setStartSlot={setStartSlot}
                        activeTab={activeTab}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="single_schedule" className="py-4">
                  <Card className="p-5">
                    <CardTitle>Booking single</CardTitle>
                    <CardDescription>
                      Book a court for a one-time session. Flexible for casual
                      players.
                    </CardDescription>
                    <CardContent className="mt-5">
                      <CalendarDaily
                        setSelectedCourts={setSelectedCourts}
                        setSelectedSlots={setSelectedSlots}
                        setDay={setSelectDay}
                        setEndSlot={setEndSlot}
                        setStartSlot={setStartSlot}
                      />
                      <TimeSlot
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        timeSlotData={timeSlots}
                        selectDay={selectDay}
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

                          {CourtData?.data?.length === 0 ? (
                            <EmptyComponent
                              title="No Court Available"
                              // description="You haven't made any bookings yet. Start booking now to manage your reservations."
                              className="w-full"
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              {isCourtPending ? (
                                <Loading />
                              ) : (
                                CourtData?.data?.map((value: ICourt) => (
                                  <Card
                                    key={value._id}
                                    className={`cursor-pointer ${
                                      selectedCourt !== null &&
                                      selectedCourt._id === value._id
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "hover:bg-muted"
                                    }`}
                                    onClick={() => handleCourtSelection(value)}
                                  >
                                    <CardContent className="grid gap-4 overflow-hidden p-5">
                                      <div className="flex items-center gap-4">
                                        <div
                                          className={`cursor-pointer rounded-lg object-cover p-2 ${
                                            selectedCourt !== null &&
                                            selectedCourt._id === value._id
                                              ? " bg-slate-500 stroke-white "
                                              : " border-white text-white "
                                          }`}
                                        >
                                          <Icons.BadmintonCourt className="rounded-lg object-cover" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold">
                                            {value.name}
                                          </h3>
                                          <span
                                            className={`line-clamp-3 text-sm ${
                                              selectedCourt !== null &&
                                              selectedCourt._id === value._id
                                                ? " text-slate-300 dark:text-slate-200 "
                                                : "text-gray-500 dark:text-gray-400"
                                            }`}
                                          >
                                            {value.description}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                          <CustomTag status={value.status} />
                                        </div>
                                        <div
                                          className={`flex items-center gap-2 text-sm ${
                                            selectedCourt !== null &&
                                            selectedCourt._id === value._id
                                              ? " text-slate-300 dark:text-slate-200 "
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        >
                                          <UsersIcon className="size-4" />
                                          <span>type: {value.type}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div
                                          className={`flex items-center gap-2 text-sm ${
                                            selectedCourt !== null &&
                                            selectedCourt._id === value._id
                                              ? " text-slate-300 dark:text-slate-200 "
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        >
                                          {/* <DollarSignIcon className="size-4" /> */}
                                          <span>
                                            {(value.price / 100).toFixed(2)}
                                            VND/slot
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                              )}
                            </div>
                          )}

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="default"
                              className="rounded-md px-6 py-2"
                              disabled={selectedCourt == null}
                              onClick={handleBooking}
                            >
                              {/* {bookingMutating && <SpinnerIcon />} */}
                              Book Selected courts
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="competition_schedule" className="py-4">
                  <Card className="p-5">
                    <CardTitle>Booking For Competition</CardTitle>
                    <CardDescription>
                      Book a court for a one-time session. Flexible for casual
                      players.
                    </CardDescription>
                    <CardContent className="mt-5">
                      <CalendarDaily
                        setSelectedCourts={setSelectedCourts}
                        setSelectedSlots={setSelectedSlots}
                        setDay={setSelectDay}
                        setEndSlot={setEndSlot}
                        setStartSlot={setStartSlot}
                      />
                      <TimeSlot
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        timeSlotData={timeSlots}
                        endSlot={endSlot}
                        selectDay={selectDay}
                        startSlot={startSlot}
                        setEndSlot={setEndSlot}
                        setStartSlot={setStartSlot}
                      />

                      {selectedSlots.length !== 0 && (
                        <div className="mx-auto mt-6 max-w-2xl">
                          <h3 className="mb-2 text-lg font-bold">
                            Select Badminton Court
                          </h3>

                          {CourtData?.data?.length === 0 ? (
                            <EmptyComponent
                              title="No Court Available"
                              // description="You haven't made any bookings yet. Start booking now to manage your reservations."
                              className="w-full"
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              {CourtData?.data?.map((value: ICourt) => (
                                <Card
                                  key={value._id}
                                  className={`cursor-pointer ${
                                    selectedCourts.length !== 0 &&
                                    selectedCourts.includes(value)
                                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                      : "hover:bg-muted"
                                  }`}
                                  onClick={() => handleCheckboxChange(value)}
                                >
                                  <CardContent className="grid gap-4 overflow-hidden p-5">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`cursor-pointer rounded-lg object-cover p-2 ${
                                          selectedCourts.length !== 0 &&
                                          selectedCourts.includes(value)
                                            ? " bg-slate-500 stroke-white "
                                            : " border-white text-white "
                                        }`}
                                      >
                                        <Icons.BadmintonCourt className="rounded-lg object-cover" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">
                                          {value.name}
                                        </h3>
                                        <span
                                          className={`line-clamp-3 text-sm ${
                                            selectedCourts.length !== 0 &&
                                            selectedCourts.includes(value)
                                              ? " text-slate-300 dark:text-slate-200 "
                                              : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        >
                                          {value.description}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CustomTag status={value.status} />
                                      </div>
                                      <div
                                        className={`flex items-center gap-2 text-sm ${
                                          selectedCourts.length !== 0 &&
                                          selectedCourts.includes(value)
                                            ? " text-slate-300 dark:text-slate-200 "
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        <UsersIcon className="size-4" />
                                        <span>type: {value.type}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`flex items-center gap-2 text-sm ${
                                          selectedCourts.length !== 0 &&
                                          selectedCourts.includes(value)
                                            ? " text-slate-300 dark:text-slate-200 "
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        {/* <DollarSignIcon className="size-4" /> */}
                                        <span>
                                          {(value.price / 100).toFixed(2)}
                                          VND/slot
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="default"
                              className="rounded-md px-6 py-2"
                              disabled={selectedCourts.length === 0}
                              onClick={handleBooking}
                            >
                              {/* {bookingMutating && <SpinnerIcon />} */}
                              Book Selected courts
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BranchDetailCustomer;
