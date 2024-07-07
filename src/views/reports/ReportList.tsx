"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";

import { getCourtByBranchIdAPI } from "@/apiCallers/courts";
import { getReportByBranchAPI } from "@/apiCallers/report";
import { DataTable } from "@/components/table/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchStore } from "@/stores/branchStore";
import { BranchStatusEnum } from "@/types";

import DetailButton from "./DetailsButton";
import { columns, type CreateReportSchemaTypeWithId } from "./help";

const ReportList = () => {
  const selectedBranch = useBranchStore((state) => state.branch);
  const [selectedCourt, setSelectedCourt] = useState("all");
  const { data, isLoading } = useQuery({
    queryKey: ["ReportList", selectedBranch?._id || ""],
    queryFn: async () =>
      getReportByBranchAPI({ branchId: selectedBranch?._id || "" }),
  });
  useEffect(() => {
    setSelectedCourt("all");
  }, [selectedBranch?._id]);
  const { data: CourtList } = useQuery({
    queryKey: ["myCourtList", (selectedBranch?._id as string) || ""],
    queryFn: async () => getCourtByBranchIdAPI(selectedBranch?._id as string),
  });
  const sortedData = useMemo(() => {
    if (!data?.data) return [];
    if (selectedCourt === "all")
      return data?.data.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    return data?.data
      .filter((item) => item.court._id === selectedCourt)
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [data?.data, selectedCourt]);

  return (
    <div className=" relative size-full overflow-auto">
      <div className="mx-auto mb-2 flex w-[400px] rounded-sm  border-b-2 border-dashed px-2 py-1 pb-4">
        <Select
          value={selectedCourt}
          onValueChange={(value) => setSelectedCourt(value)}
          defaultValue="all"
        >
          <SelectTrigger className="">
            <SelectValue
              className="p-2"
              placeholder={
                selectedBranch
                  ? `Select court of ${selectedBranch?.name}`
                  : "Select court"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {selectedBranch
                ? `All court of ${selectedBranch?.name}`
                : "All court"}
            </SelectItem>
            {CourtList?.data?.map((court) => (
              <SelectItem key={court._id} value={court._id}>
                {/* <Avatar>
                    <AvatarImage src={court.images[0]} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar> */}
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        navigation={false}
        CreateButton={<DetailButton selectedCourt={selectedCourt} />}
        canCreate={
          (selectedBranch?.status === BranchStatusEnum.ACTIVE ||
            selectedBranch?.status === BranchStatusEnum.INACTIVE) &&
          selectedBranch
        }
        columns={columns}
        data={(sortedData || []) as CreateReportSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportList;
