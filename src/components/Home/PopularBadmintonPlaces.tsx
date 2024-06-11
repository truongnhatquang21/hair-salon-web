"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getAllBadminton } from "@/app/api/unauth/popular-badminton-place";
import type IBadminton from "@/types/badminton";

const PopularBadmintonPlaces = () => {
  const t = useTranslations("PopularBadminton");
  const [badminton, setBadminton] = useState<IBadminton[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBadminton();
        setBadminton(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (error) {
    return <p>{t("error", { error })}</p>;
  }
  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold">{t("title")}</h2>
      <p className="mb-8">{t("description")}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {badminton.map((bad: IBadminton) => (
          <div key={bad.id} className="overflow-hidden rounded-sm shadow-lg">
            <Link href={`/badminton/${bad.id}`}>
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
