"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { getBranchByIdAPI } from "@/apiCallers/Branches";
import { getCourtByIdAPI } from "@/apiCallers/courts/index";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import CustomTag from "../CustomTag";
import { EmptyComponent } from "../Empty";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CourtCarousel } from "./CourtCarousel";
import { PriceTooltip } from "./PriceToolTip";

type CourtDetailProps = {
  id: string;
};

const CourtDetailPage = ({ id }: CourtDetailProps) => {
  const t = useTranslations("CourtDetail");
  const {
    data: courtData,
    isLoading: isCourtLoading,
    isError: isCourtError,
    error: courtError,
  } = useQuery({
    queryKey: ["courtDetails", id],
    queryFn: async () => getCourtByIdAPI(id),
  });

  const court = courtData?.data ?? null;

  const {
    data: branchData,
    isLoading: isBranchLoading,
    isError: isBranchError,
    error: branchError,
  } = useQuery({
    queryKey: ["branchDetails", court?.branch],
    queryFn: async () => getBranchByIdAPI(court?.branch),
    enabled: !!court?.branch,
  });

  const branch = branchData?.data ?? null;
  if (isCourtLoading || isBranchLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (courtError) {
    return (
      <div className="flex items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("Error")}</AlertTitle>
          <AlertDescription>{courtError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isCourtError) {
    return <div>{t("notFound")}</div>;
  }

  return court ? (
    <div className="mx-auto my-4 px-2">
      {/* Court information */}
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="w-full px-11">
            {court?.images && court?.images.length > 0 && (
              <CourtCarousel
                court_images={court?.images}
                court_name={court?.name}
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div>
            <div className="mb-3 flex items-start justify-between">
              <p>
                <h1 className="text-3xl font-bold">{court.name}</h1>
                <p className="flex items-center gap-2 text-sm opacity-80">
                  <Users className="text-sm" /> {court.type}
                </p>
              </p>

              <CustomTag status={court.status} />
            </div>
            <Separator className="my-2" />
          </div>
          <p className="text-lg">
            <div className="flex items-start gap-1">
              <div className="flex items-center gap-1">
                <DollarSign className="text-red-600" />
                <span className="text-2xl font-medium text-red-600">
                  {court.price}
                </span>
              </div>
              <PriceTooltip
                price={court.price}
                specialPrice={court.price}
                weekendPrice={court.price}
              />
            </div>
          </p>
          <p className="mt-3 text-lg">
            <strong>{t("description")}:</strong>
            <p>{court.description}</p>
          </p>
          <div className="mt-6">
            <Link href="/booking">
              <Button variant="default" className="w-full">
                Book now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Branch information */}
      <Link href={`/branch/${branch?._id}`}>
        <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Link href={`/branch/${branch?._id}`}>
              <Avatar>
                <AvatarImage
                  sizes="lg"
                  src={branch?.images[0]?.src ?? ""}
                  alt={branch?.name ?? "branch_logo"}
                />
                <AvatarFallback>
                  {branch?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <p>
              <h3 className="ml-6 text-xl font-bold">{branch?.name}</h3>
              <div className="flex items-center gap-1 opacity-75">
                <MapPin />
                {branch?.address}
              </div>
            </p>
          </div>
          <Link href={`/branch/${branch?._id}`}>
            <Button variant="outline">View branch</Button>
          </Link>
        </div>
      </Link>
    </div>
  ) : (
    <EmptyComponent
      title="No Court Found"
      description="This court is not available!"
      className="w-full"
    />
  );
};

export default CourtDetailPage;
