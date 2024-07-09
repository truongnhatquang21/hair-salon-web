"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getProfileAPI } from "@/apiCallers/auth";
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
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={
          selectedBranch?.status !== BranchStatusEnum.DENIED &&
          selectedBranch &&
          profileData?.data?.role === "Manager"
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
