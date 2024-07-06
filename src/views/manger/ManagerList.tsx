"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getManagerListAPI } from "@/apiCallers/manager";
import { DataTable } from "@/components/table/DataTable";

import { columns, type CreateManagerSchemaTypeWithId } from "./helper";

const ManagerList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["managerList"],
    queryFn: async () => getManagerListAPI(),
  });

  console.log(data?.data, "manager list data");

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={false}
        columns={columns}
        data={(data?.data || []) as CreateManagerSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ManagerList;
