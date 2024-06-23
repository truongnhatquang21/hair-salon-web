import { useQuery } from "@tanstack/react-query";

import { getBranchListAPI } from "@/apiCallers/Branches";
import { DataTable } from "@/components/table/DataTable";

import { type BranchSchemaType, columns, sampleData } from "./helper";

export default async function BranchesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: () => getBranchListAPI(sampleData),
  });
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        columns={columns}
        data={(data?.data || []) as BranchSchemaType[]}
        isLoading={isLoading}
      />
    </div>
  );
}
