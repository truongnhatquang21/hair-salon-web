"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubscriptionListAPI } from "@/apiCallers/adminSubcription";
import { DataTable } from "@/components/table/DataTable";

import CreateSubscriptionButton from "./CreateSubscriptionButton";
import { columns, type PackageCourtSchemaType, sampleData } from "./helper";

const SubscriptionList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptionListAPI(sampleData),
  });
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        CreateButton={<CreateSubscriptionButton />}
        columns={columns}
        data={data?.data || ([] as PackageCourtSchemaType[])}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubscriptionList;
