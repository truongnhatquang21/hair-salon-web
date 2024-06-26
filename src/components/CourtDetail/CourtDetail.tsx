"use client";

import { AlertCircle, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { getCourtById } from "@/app/api/unauth/court";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type ICourt from "@/types/court";

import CustomTag from "../CustomTag";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CourtCarousel } from "./CourtCarousel";
import { PriceTooltip } from "./PriceToolTip";

type CourtDetailProps = {
  id: string;
};

const CourtDetailPage = (props: CourtDetailProps) => {
  const t = useTranslations("CourtDetail");
  const [court, setCourt] = useState<ICourt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [progress, setProgress] = React.useState(13);

  useEffect(() => {
    const fetchData = async () => {
      let timer;
      try {
        const data = await getCourtById(props.id);
        setCourt(data);
        timer = setTimeout(() => setProgress(66), 500);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        timer = setTimeout(() => setProgress(100), 200);
        setLoading(false);

        clearTimeout(timer);
      }
    };

    fetchData();
  }, [props.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Progress value={progress} className="w-3/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("Error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!court) return <div>{t("notFound")}</div>;

  return (
    <div className="mx-auto my-4 px-2">
      {/* Court information */}
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="w-full px-11">
            {court.images && court.images.length > 0 && (
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
      <div className="mt-3 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Link href={`/branch/${court.branch_id}`}>
            <Avatar>
              <AvatarImage
                sizes="lg"
                src={court?.branch_images[0]?.src ?? ""}
                alt={court?.branch_name ?? "branch_logo"}
              />
              <AvatarFallback>
                {court.branch_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <p>
            <h3 className="text-xl font-bold">{court.branch_name}</h3>
            <div className="flex items-center gap-1 opacity-75">
              <MapPin />
              {court.branch_address}
            </div>
          </p>
        </div>
        <Link href={`/branch/${court.branch_id}`}>
          <Button variant="outline">View branch</Button>
        </Link>
      </div>
    </div>
  );
};

export default CourtDetailPage;
