"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getListStaffAPI } from "@/apiCallers/staff";
import { DataTable } from "@/components/table/DataTable";

import DetailButton from "./DetailsButton";
import { columns, type CreateStaffSchemaTypeWithId } from "./help";

const StaffList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => getListStaffAPI(),
  });

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        CreateButton={<DetailButton />}
        columns={columns}
        data={(data?.data || []) as CreateStaffSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StaffList;
