"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { searchBranchesAPI } from "@/apiCallers/Branches"; // Import your API call function
import SearchSection from "@/components/Home/SearchSection";
import ResultSection from "@/components/SearchAllBranch/ResultSection";
import type IBranch from "@/types/branch";

type SearchAllBranchProps = {
  initialKeyword?: string;
};

const SearchAllBranch = ({ initialKeyword = "" }: SearchAllBranchProps) => {
  const t = useTranslations("SearchAllBranch");
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch data if initialKeyword is provided
    if (initialKeyword) {
      fetchBranches(initialKeyword);
    }
  }, [initialKeyword]);

  const fetchBranches = async (keyword: string) => {
    try {
      const response = await searchBranchesAPI({ keyword }); // Replace with your API call
      setBranches(response.data);
      setTotalPages(1); // Update this if pagination is implemented
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = (data: any) => {
    setBranches(data);
    setTotalPages(1);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle pagination if needed
  };

  return (
    <div>
      <SearchSection onSearch={handleSearch} initialKeyword={initialKeyword} />
      <ResultSection
        branches={branches}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchAllBranch;
