"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getReportByBranchAPI } from "@/apiCallers/report";
import { DataTable } from "@/components/table/DataTable";
import { useBranchStore } from "@/stores/branchStore";

import DetailButton from "./DetailsButton";
import { columns, type CreateReportSchemaTypeWithId } from "./help";

const ReportList = () => {
  const selectedBranch = useBranchStore((state) => state.branch);
  const { data, isLoading } = useQuery({
    queryKey: ["ReportList", selectedBranch?._id || ""],
    queryFn: async () =>
      getReportByBranchAPI({ branchId: selectedBranch?._id || "" }),
  });

  console.log(data, "dasod");

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        CreateButton={<DetailButton />}
        columns={columns}
        data={(data?.data || []) as CreateReportSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportList;
