"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getBranchByIdAPI } from "@/apiCallers/Branches";
import BranchDetailOverview from "@/components/branchs/BranchDetailOverview";
import CalendarDaily from "@/components/Custom/DailyCalendar";
import { TimeSlot } from "@/components/TimeSlot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["brachDetail"],
    queryFn: async () => getBranchByIdAPI(slug),
  });

  if (isLoading) {
    return <div>Loading</div>;
  }
  console.log("line 41: ", data);
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
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="py-4">
            <BranchDetailOverview data={data} />
          </TabsContent>
          <TabsContent value="schedules" className="py-4">
            <div>This is the details tab content.</div>
            <div>
              <CalendarDaily />
              <TimeSlot timeSlotData={data.slots} />
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
