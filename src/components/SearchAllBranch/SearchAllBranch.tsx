"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SearchSection from "@/components/Home/SearchSection";
import ResultSection from "@/components/SearchAllBranch/ResultSection";
import type IBranch from "@/types/branch";

type SearchAllBranchProps = {
  initialKeyword?: string;
};

const SearchAllBranch = ({ initialKeyword }: SearchAllBranchProps) => {
  const t = useTranslations("SearchAllBranch");
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");

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
