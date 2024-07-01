"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSignIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { getBranchByIdAPI } from "@/apiCallers/Branches";
import BranchDetailOverview from "@/components/branchs/BranchDetailOverview";
import CalendarDaily from "@/components/Custom/DailyCalendar";
import { Icons } from "@/components/icons";
import { Loading } from "@/components/loading";
import { TimeSlot } from "@/components/TimeSlot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ICourt } from "@/interfaces/court.interface";
import type { ISlot } from "@/interfaces/slot.interface";
import { getThu } from "@/utils/Helpers";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();
  const [selectDay, setSelectDay] = useState<Date | undefined>(new Date());
  const [startSlot, setStartSlot] = useState(null);
  const [endSlot, setEndSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brachDetail"],
    queryFn: async () => getBranchByIdAPI(slug),
  });
  const timeSlots = useMemo(() => {
    const slotArray = data?.slots?.filter((el: ISlot) =>
      el.weekDay.includes(getThu(selectDay))
    );
    return slotArray;
  }, [data?.slots, selectDay]);
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {startSlot &&
                  data.courts.map((court: ICourt) => {
                    return (
                      <Card key={court._id}>
                        <CardContent className="grid gap-4 overflow-hidden p-5">
                          <div className="flex items-center gap-4">
                            <Icons.BadmintonCourt className="rounded-lg object-cover" />
                            {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                            <div>
                              <h3 className="font-semibold">{court.name}</h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {court.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Badge
                                variant="solid"
                                className="bg-yellow-500 text-white"
                              >
                                Pending
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <UsersIcon className="size-4" />
                              <span>type: {court.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <DollarSignIcon className="size-4" />
                              <span>{court.price}/hr</span>
                            </div>
                            {/* <Button variant="outline" size="sm">
                        Book Now
                      </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="map" className="py-4">
            <div>This is the reviews tab content.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
