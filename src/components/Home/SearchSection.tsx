"use client";

import { useMutation } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { searchBranchesAPI } from "@/apiCallers/Branches"; // Import your API call function
import type { IBranch } from "@/interfaces/branch.interface";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type SearchSectionProps = {
  initialKeyword?: string;
  onSearch: (data: any) => void;
};

const SearchSection = ({
  initialKeyword = "",
  onSearch,
}: SearchSectionProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);

  useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  const mutation = useMutation({
    mutationFn: searchBranchesAPI,
    onSuccess: (data) => {
      onSearch(
        data?.data?.filter((branch: IBranch) => branch?.status === "Active")
      );
      router.push({
        pathname: "/search",
        query: { query: keyword?.trim() }, // Ensure the URL query parameter is updated
      });
    },
    onError: (error) => {
      console.error("Error fetching search results:", error);
    },
  });

  const handleSearch = () => {
    setKeyword((prevKeyword) => prevKeyword?.trim());
    mutation.mutate({ keyword });
    router.push({
      pathname: "/search",
      query: { query: keyword },
    });
  };

  return (
    <div>
      <div className="mt-5 flex justify-center space-x-2 rounded-lg p-2">
        <div className="search-address-container autocomplete-container flex w-3/6 cursor-pointer items-center rounded-md border-0 border-input bg-gray-200 pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:ring-0">
          <MapPin />
          <Input
            type="search"
            placeholder="Search court address, name..."
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            className="flex h-10 w-full rounded-md border-0 bg-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          variant="default"
          className="rounded-lg p-2 px-4 text-white"
          onClick={handleSearch}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default SearchSection;
