"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getMyTransaction } from "@/apiCallers/trasaction";
import { DataTable } from "@/components/table/DataTable";

import { columns, type TransactionTypeWithId } from "./helper";

const TransactionList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["TransactionList"],
    queryFn: async () => getMyTransaction(),
  });
  console.log(data, "dsd");

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={false}
        columns={columns}
        data={(data?.data || []) as TransactionTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionList;
