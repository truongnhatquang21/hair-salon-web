"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getListStaffAPI } from "@/apiCallers/staff";
import { DataTable } from "@/components/table/DataTable";
import { useBranchStore } from "@/stores/branchStore";
import { BranchStatusEnum } from "@/types";

import DetailButton from "./DetailsButton";
import { columns, type CreateStaffSchemaTypeWithId } from "./help";

const StaffList = () => {
  const selectedBranch = useBranchStore((state) => state.branch);
  const { data, isLoading } = useQuery({
    queryKey: ["staffList", selectedBranch?._id || ""],
    queryFn: async () => getListStaffAPI({ branch: selectedBranch?._id || "" }),
  });

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        CreateButton={<DetailButton />}
        canCreate={
          selectedBranch?.status === BranchStatusEnum.ACTIVE ||
          selectedBranch?.status === BranchStatusEnum.INACTIVE
        }
        columns={columns}
        data={(data?.data || []) as CreateStaffSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StaffList;
