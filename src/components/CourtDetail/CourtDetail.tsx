"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { getCourtById } from "@/app/api/unauth/court";
import type ICourt from "@/types/court";

type CourtDetailProps = {
  id: string;
};
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_COURT}`);
    const courts = await response.json();
    return courts.map((court: { id: string }) => ({
      slug: court.id,
    }));
  } catch (error) {
    return [];
  }
}

const CourtDetailPage = (props: CourtDetailProps) => {
  const t = useTranslations("CourtDetail");
  const [court, setCourt] = useState<ICourt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourtById(props.id);
        setCourt(data);
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

  if (!court) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-3xl font-bold">{court.name}</h1>
      <p>Type: {court.type}</p>
      <p>Price: ${court.price}</p>
      <p>Status: {court.status}</p>
    </div>
  );
};

export default CourtDetailPage;
