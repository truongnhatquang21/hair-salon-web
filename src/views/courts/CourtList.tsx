"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getCourtByBranchIdAPI } from "@/apiCallers/courts";
import { DataTable } from "@/components/table/DataTable";
import { useBranchStore } from "@/stores/branchStore";

import { BranchStatusEnum } from "../branches/helper";
import CreateButton from "./CreateButton";
import { columns, type CourtSchemaTypeWithId } from "./helper";

const CourtList = () => {
  const selectedBranch = useBranchStore((state) => state.branch);
  const { data, isLoading } = useQuery({
    queryKey: ["myCourtList", (selectedBranch?._id as string) || ""],
    queryFn: async () => getCourtByBranchIdAPI(selectedBranch?._id as string),
  });

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={
          selectedBranch?.status !== BranchStatusEnum.DENIED && selectedBranch
        }
        CreateButton={<CreateButton />}
        columns={columns}
        data={(data?.data || []) as CourtSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CourtList;
