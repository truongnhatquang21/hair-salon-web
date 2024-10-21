'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getListStylistAPI } from '@/apiCallers/stylelist';
import { DataTable } from '@/components/table/DataTable';
import { useBranchStore } from '@/stores/branchStore';
import { BranchStatusEnum } from '@/types';

import DetailButton from './DetailsButton';
import { columns, type CreateStaffSchemaTypeWithId } from './help';

const StylelistList = () => {
  const selectedBranch = useBranchStore((state) => state.branch);
  const { data, isLoading } = useQuery({
    queryKey: ['stylelistList', selectedBranch?._id || ''],
    queryFn: async () =>
      getListStylistAPI({ branch: selectedBranch?._id || '' }),
  });

  return (
    <div className=' relative size-full overflow-auto'>
      <DataTable
        navigation={false}
        CreateButton={<DetailButton />}
        canCreate={
          selectedBranch?.status === BranchStatusEnum.ACTIVE ||
          selectedBranch?.status === BranchStatusEnum.INACTIVE
        }
        columns={columns}
        data={(data?.data || []) as CreateStaffSchemaTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StylelistList;
