"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getMyBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import CreateButton from "./CreateButton";
import { type BranchSchemaType, columns } from "./helper";

export default function BranchesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["myBranches"],
    queryFn: async () => getMyBranchListAPI(),
  });

  const sortedData = useMemo(() => {
    if (!data?.data) return [];
    return data?.data?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data?.data]);

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        CreateButton={<CreateButton />}
        columns={columns}
        data={(sortedData || []) as BranchSchemaType[]}
        isLoading={isLoading}
      />
    </div>
  );
}
