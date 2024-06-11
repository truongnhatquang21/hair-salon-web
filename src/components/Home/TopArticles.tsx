"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getAllTopArticles } from "@/app/api/unauth/top-articles";
import type IArticle from "@/types/article";

const TopArticles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const t = useTranslations("TopArticles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTopArticles();
        setArticles(data);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="relative overflow-hidden rounded-sm shadow-lg"
          >
            <Link href={`/article/${article.id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="h-48 object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="line-clamp-2 font-semibold text-white">
                  {article.title}
                </h3>
                <span className="line-clamp-2 text-sm text-white">
                  {article.description}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticles;
