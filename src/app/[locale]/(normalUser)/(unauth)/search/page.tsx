"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SearchAllBranch from "@/components/SearchAllBranch/SearchAllBranch";

const SearchPage = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    if (router.query && router.query.keyword) {
      const { keyword } = router.query;
      if (typeof keyword === "string") {
        setKeyword(keyword);
      }
    }
  }, [router.query]);

  return (
    <div>
      <SearchAllBranch />
    </div>
  );
};

export default SearchPage;
