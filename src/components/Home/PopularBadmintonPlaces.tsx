"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { getBranchListAPI } from "@/apiCallers/Branches";
import { Loading } from "@/components/loading";
import type IBadminton from "@/types/badminton";

const PopularBadmintonPlaces = () => {
  const t = useTranslations("PopularBadminton");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["branches"], // Unique key for this query
    queryFn: () => getBranchListAPI(), // Function to fetch the data
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

  const badminton: IBadminton = data?.data ?? []; // Ensure data is always an array

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold">{t("title")}</h2>
      <p className="mb-8">{t("description")}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {badminton?.map((bad: IBadminton) => (
          <div key={bad._id} className="overflow-hidden rounded-sm shadow-lg">
            <Link href={`/branch/${bad._id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={bad.images[0] ?? ""}
                  alt={bad.name}
                  className="h-48 object-cover"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{bad.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBadmintonPlaces;
