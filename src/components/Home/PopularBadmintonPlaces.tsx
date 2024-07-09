"use client";

import { useQuery } from "@tanstack/react-query";
import { AlignLeft, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { getPopularBranchListAPI } from "@/apiCallers/Branches";
import { Loading } from "@/components/loading";
import type IBadminton from "@/types/badminton";

import CustomTag from "../CustomTag";
import { EmptyComponent } from "../Empty";

const PopularBadmintonPlaces = () => {
  const t = useTranslations("PopularBadminton");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["popularBranches"],
    queryFn: () => getPopularBranchListAPI(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh_-_56px)]  items-center justify-center p-5">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <p>
        {t("error", {
          error: error?.message || "An unexpected error occurred",
        })}
      </p>
    ); // Handle error state
  }

  const badminton: IBadminton[] =
    data?.data?.filter((br) => br.status === "Active") ?? [];
  console.log(badminton);
  return badminton && badminton?.length > 0 ? (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold">{t("title")}</h2>
      <div>
        <div className="mt-2">
          {badminton?.length > 0 ? (
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {badminton?.map((br: IBadminton) => (
                <div
                  key={br?._id}
                  className="rounded-lg border border-green-500 bg-white p-2 shadow-md"
                >
                  <Link href={`/branch/${br?._id}`}>
                    <div className="relative h-48">
                      <Image
                        src={br?.images?.length > 0 ? br?.images[0] : ""}
                        alt={br?.name}
                        layout="fill"
                        objectFit="cover"
                        className="h-48 rounded-md object-cover"
                      />
                    </div>
                    <div className="my-1">
                      <CustomTag status={br?.status ?? "Active"} />
                    </div>
                    <h2 className="mt-2 text-lg font-bold">{br.name}</h2>
                    <div className="flex items-start gap-1">
                      <div className="w-5">
                        <MapPin className="w-5" />
                      </div>
                      <span className="text-sm">{br?.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-5">
                        <AlignLeft className="w-5" />
                      </div>
                      <p className="description flex overflow-hidden truncate text-sm">
                        {br?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-5">
                        <Clock className="w-5" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {br?.availableTime}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyComponent
              title="No Branch Found"
              description="Search other keyword instead!"
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <EmptyComponent
      title="No Popular Badminton Found"
      description="This is empty!"
      className="w-full"
    />
  );
};

export default PopularBadmintonPlaces;
