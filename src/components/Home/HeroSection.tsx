"use client";

import "@/styles/home.css";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { type Option } from "@/components/ui/autocomplete";

import { Button } from "../ui/button";
import { SearchCourtAddress } from "./SearchCourtAddress";

const HeroSection = () => {
  const t = useTranslations("HeroSection");
  const [address, setAddress] = useState<Option | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const handleSearch = () => {
    const searchParams = {
      address: address?.label || "",
      date,
      time,
      type,
    };

    console.log("Search Params:", searchParams);
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
          <SearchCourtAddress onValueChange={setAddress} />
        </div>

        {/* <Input
          icon={<CalendarDays />}
          className="cursor-pointer border-0 bg-gray-200 focus-visible:ring-0"
          placeholder="Badminton court address"
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          icon={<Clock />}
          className="cursor-pointer border-0 bg-gray-200 focus-visible:ring-0 "
          placeholder="Badminton court address"
          type="time"
          onChange={(e) => setTime(e.target.value)}
        />
        <Select onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-[180px] border-0 bg-gray-200">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value="2players">2 players</SelectItem>
              <SelectItem value="4players">4 players</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
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
