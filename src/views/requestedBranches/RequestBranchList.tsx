"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import type { BranchSchemaType } from "../branches/helper";
import { columns } from "./helper";

type Props = {};

const RequestBranchList = (props: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["myBranches"],
    queryFn: async () => getBranchListAPI(),
  });

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
