"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SearchAllBranch from "@/components/SearchAllBranch/SearchAllBranch";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    // Extract the query parameter from the URL
    const query = searchParams.get("query");
    if (query) {
      setKeyword(query);
    }
  }, [searchParams]);

  return (
    <div>
      <SearchAllBranch initialKeyword={keyword} />
    </div>
  );
};

export default SearchPage;
