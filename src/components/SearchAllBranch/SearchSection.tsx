"use client";

import "@/styles/home.css";

import { CalendarDays, Clock, Filter, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { SearchCourtAddress } from "@/components/Home/SearchCourtAddress";
import { type Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input-icon";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type SearchFullParams = {
  onSearchChange: (params: SearchParams) => void;
  address: Option | null;
  date: string;
  time: string;
  type: string;
  showStatusBar: boolean;
  showActivityBar: boolean;
  showPanel: boolean;
  setAddress: (address: Option | null) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setType: (type: string) => void;
  setShowStatusBar: (checked: boolean) => void;
  setShowActivityBar: (checked: boolean) => void;
  setShowPanel: (checked: boolean) => void;
};

type SearchParams = {
  address: Option | null;
  date: string;
  time: string;
  type: string;
  showStatusBar: boolean;
  showActivityBar: boolean;
  showPanel: boolean;
};

const SearchSection = ({
  onSearchChange,
  address,
  date,
  time,
  type,
  showStatusBar,
  showActivityBar,
  showPanel,
  setAddress,
  setDate,
  setTime,
  setType,
  setShowStatusBar,
  setShowActivityBar,
  setShowPanel,
}: SearchFullParams) => {
  const t = useTranslations("SearchAllBranch");

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSearchChange = () => {
    onSearchChange({
      address,
      date,
      time,
      type,
      showStatusBar,
      showActivityBar,
      showPanel,
    });
  };

  // useEffect(() => {
  //   handleSearchChange();
  // }, [address, date, time, type, showStatusBar, showActivityBar, showPanel]);

  return (
    <div>
      <div className="flex items-end justify-between space-x-2 p-4">
        <div>
          <h3 className="font-bold">{t("where")}</h3>
          <div className="search-address-container autocomplete-container flex h-10 cursor-pointer items-center rounded-md border border-input pl-3 text-sm outline-1 ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:ring-0">
            <MapPin />
            <SearchCourtAddress onValueChange={setAddress} />
          </div>
        </div>
        <div>
          <h3 className="font-bold">{t("date")}</h3>
          <Input
            icon={<CalendarDays />}
            className="cursor-pointer outline-1 focus-visible:ring-0"
            placeholder="Select a date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-bold">{t("time")}</h3>
          <Input
            icon={<Clock />}
            className="cursor-pointer outline-1 focus-visible:ring-0"
            placeholder="Select a time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-bold">{t("type")}</h3>
          <Select onValueChange={(value) => setType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("type_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("type")}</SelectLabel>
                <SelectItem value="2players">{t("option_1")}</SelectItem>
                <SelectItem value="4players">{t("option_2")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>{" "}
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter />
                {t("filter")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{t("filter_label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                {t("filter_value_1")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                {t("filter_value_2")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                {t("filter_value_3")}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="airplane-mode">{t("switch_label")}</Label>
          <Switch id="airplane-mode" />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
