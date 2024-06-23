"use client";

import { useQuery } from "@tanstack/react-query";

import { getBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import { type BranchSchemaType, columns, sampleData } from "./helper";

export default function BranchesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => getBranchListAPI(sampleData),
  });
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        columns={columns}
        data={(data?.data || []) as BranchSchemaType[]}
        isLoading={isLoading}
      />
    </div>
  );
}
