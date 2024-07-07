"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import { getBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import type { BranchSchemaType } from "../branches/helper";
import { columns } from "./helper";

type Props = {};

const RequestBranchList = (props: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allBranches"],
    queryFn: async () => {
      return getBranchListAPI();
    },
  });
  const sortData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data?.data]);
  console.log(data?.data);
  console.log(error);

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        canCreate={false}
        columns={columns}
        data={(data?.data || []) as BranchSchemaType[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RequestBranchList;
