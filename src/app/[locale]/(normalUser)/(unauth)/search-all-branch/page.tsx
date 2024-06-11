"use client";

import "@/styles/home.css";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { getAllSearchedBranch } from "@/app/api/unauth/branch";
import ResultSection from "@/components/SearchAllBranch/ResultSection";
import SearchSection from "@/components/SearchAllBranch/SearchSection";
import { type Option } from "@/components/ui/autocomplete";
import type IBranch from "@/types/branch";

const SearchAllBranch = () => {
  const t = useTranslations("SearchAllBranch");

  const [branch, setBranch] = useState<IBranch[]>([]);
  const [address, setAddress] = useState<Option | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchBranches = async (page: number) => {
    setLoading(true);
    try {
      const data = await getAllSearchedBranch(page, itemsPerPage, {
        address: address?.label || "",
        date,
        time,
        type,
        showStatusBar,
        showActivityBar,
        showPanel,
      });
      setBranch(data.items);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
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

  useEffect(() => {
    fetchBranches(currentPage);
  }, [currentPage]);

  type SearchParams = {
    address: Option | null;
    date: string;
    time: string;
    type: string;
    showStatusBar: boolean;
    showActivityBar: boolean;
    showPanel: boolean;
  };
  const handleSearchChange = (newParams: SearchParams) => {
    setAddress(newParams.address);
    setDate(newParams.date);
    setTime(newParams.time);
    setType(newParams.type);
    setShowStatusBar(newParams.showStatusBar);
    setShowActivityBar(newParams.showActivityBar);
    setShowPanel(newParams.showPanel);
    setCurrentPage(1); // Reset to first page on search
    fetchBranches(1); // Fetch with new parameters
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (error) {
    return <p>{t("error", { error })}</p>;
  }

  return (
    !loading && (
      <div>
        <SearchSection
          onSearchChange={handleSearchChange}
          address={address}
          date={date}
          time={time}
          type={type}
          showStatusBar={showStatusBar}
          showActivityBar={showActivityBar}
          showPanel={showPanel}
          setAddress={setAddress}
          setDate={setDate}
          setTime={setTime}
          setType={setType}
          setShowStatusBar={setShowStatusBar}
          setShowActivityBar={setShowActivityBar}
          setShowPanel={setShowPanel}
        />
        <ResultSection
          branches={branch}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  );
};

export default SearchAllBranch;
