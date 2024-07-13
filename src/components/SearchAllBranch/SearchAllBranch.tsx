"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { searchBranchesAPI } from "@/apiCallers/Branches"; // Import your API call function
import SearchSection from "@/components/Home/SearchSection";
import ResultSection from "@/components/SearchAllBranch/ResultSection";
import type IBranch from "@/types/branch";

import { Loading } from "../loading";

type SearchAllBranchProps = {
  initialKeyword?: string;
};

const SearchAllBranch = ({ initialKeyword = "" }: SearchAllBranchProps) => {
  const t = useTranslations("SearchAllBranch");
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setisLoading] = useState(true);

  const fetchBranches = async (keyword: string) => {
    try {
      setisLoading(true);
      const response = await searchBranchesAPI({ keyword }); // Replace with your API call
      setBranches(
        response?.data?.filter((branch: IBranch) => branch?.status === "Active")
      );
      setTotalPages(1); // Update this if pagination is implemented
      setCurrentPage(1);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  useEffect(() => {
    console.log(initialKeyword);
    // Fetch data if initialKeyword is provided
    if (initialKeyword) {
      fetchBranches(initialKeyword);
    }
  }, [initialKeyword]);
  const handleSearch = (data: any) => {
    setisLoading(true);
    setBranches(data);
    setTotalPages(1);
    setCurrentPage(1);
    setisLoading(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle pagination if needed
  };
  console.log(branches);

  return (
    <div>
      <SearchSection onSearch={handleSearch} initialKeyword={initialKeyword} />
      {isLoading ? (
        <Loading />
      ) : (
        <ResultSection
          branches={branches}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchAllBranch;
