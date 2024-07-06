"use server";

import type {
  CreateReportSchemaType,
  CreateReportSchemaTypeWithId,
} from "@/views/reports/help";

import { fetcher } from ".";

export const getReportListByCourtAPI = async ({
  courtId,
}: {
  courtId: string;
}) => {
  return fetcher<CreateReportSchemaTypeWithId>(
    `courtReport/get-by-court/${courtId}`
  );
};

export const getReportByBranchAPI = async ({
  branchId,
}: {
  branchId: string;
}) => {
  return fetcher<CreateReportSchemaTypeWithId>(
    `court-report/get-by-branch/${branchId}`
  );
};

export const postReportAPI = async (data: CreateReportSchemaType) => {
  return fetcher<CreateReportSchemaTypeWithId>(
    `court-report/create/${data.court}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const updateReportAPI = async (data: CreateReportSchemaTypeWithId) => {
  return fetcher<CreateReportSchemaTypeWithId>(`court-report/${data._id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteReportAPI = async (id: string) => {
  return fetcher<CreateReportSchemaTypeWithId>(`court-report/${id}`, {
    method: "DELETE",
  });
};
