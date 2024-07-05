"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import CreateButton from "./CreateButton";
import { type BranchSchemaType, columns } from "./helper";

export default function BranchesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["myBranches"],
    queryFn: async () => getMyBranchListAPI(),
  });

  console.log(data?.data, "oadso");

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        CreateButton={<CreateButton />}
        columns={columns}
        data={(data?.data || []) as BranchSchemaType[]}
        isLoading={isLoading}
      />
    </div>
  );
}
