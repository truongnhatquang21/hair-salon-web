"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import { getMyTransaction } from "@/apiCallers/trasaction";
import { DataTable } from "@/components/table/DataTable";

import { columns, type TransactionTypeWithId } from "./helper";

const TransactionList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["TransactionList"],
    queryFn: async () => getMyTransaction(),
  });
  console.log(data, "dsd");

  const dataSort = useMemo(() => {
    if (!data?.data) return [];
    return data?.data?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data?.data]);
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={false}
        columns={columns}
        data={(dataSort || []) as TransactionTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionList;
