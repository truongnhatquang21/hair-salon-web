"use client";

import "@/styles/home.css";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const HeroSection = () => {
  const t = useTranslations("HeroSection");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    router.push({
      pathname: "/search",
      query: { keyword: searchQuery },
    });
  };
  return (
    <div>
      <div className="relative flex h-[400px] justify-center rounded-lg">
        <div className="absolute inset-0 rounded-md">
          <Image
            src="/assets/images/home-background.png"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
          <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
          <p className="mb-8 text-center">{t("description")}</p>
        </div>
      </div>
      <div className="mt-5 flex justify-center space-x-2 rounded-lg p-2">
        <div className="search-address-container autocomplete-container flex w-3/6 cursor-pointer items-center rounded-md border-0 border-input bg-gray-200 pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:ring-0">
          <MapPin />
          <Input
            type="search"
            placeholder="Search court address, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border-0 bg-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          variant="default"
          className="rounded-lg p-2 px-4 text-white"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
