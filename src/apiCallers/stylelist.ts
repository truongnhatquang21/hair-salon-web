'use server';

import type { CreateStaffSchemaTypeWithId } from '@/views/stylists/help';

import { fetcher } from '.';

export const getListStylistAPI = async ({ branch }: { branch: string }) => {
  if (!branch) return [];
  return fetcher<CreateStaffSchemaTypeWithId[]>(
    `/stylist/get-by-branch/${branch}`
  );
};

export const postCreateStylistAPI = async (
  data: CreateStaffSchemaTypeWithId & {
    branch: string;
    manager: string;
  }
) => {
  return fetcher<CreateStaffSchemaTypeWithId>('/stylist', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
