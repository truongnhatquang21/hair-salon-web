"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getOperatorListAPI } from "@/apiCallers/operator";
import { DataTable } from "@/components/table/DataTable";

import DetailButton from "./DetailsButton";
import { columns, type CreateOperaterSchemaTypeWithId } from "./helper";

const OperatorList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["operatorList"],
    queryFn: async () => getOperatorListAPI(),
  });

  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        CreateButton={<DetailButton />}
        navigation={false}
        columns={columns}
        data={(data?.data || []) as CreateOperaterSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OperatorList;
