"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getCustomerListAPI } from "@/apiCallers/Customer";
import { DataTable } from "@/components/table/DataTable";

import { columns, type CreateCustomerSchemaTypeWithId } from "./helper";

const CustomerList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customerList"],
    queryFn: async () => getCustomerListAPI(),
  });

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={false}
        columns={columns}
        data={(data?.data || []) as CreateCustomerSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CustomerList;
