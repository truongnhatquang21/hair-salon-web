import React from "react";

import { BranchAutoForm } from "./BranchForm";

type Props = {};

export const CreateView = (props: Props) => {
  return (
    <div className="relative flex h-full max-w-xl flex-col gap-4 overflow-auto ">
      <h1 className="text-2xl font-semibold">Create new branch</h1>
      <div className="relative flex-1 overflow-auto p-4">
        <BranchAutoForm />
      </div>
    </div>
  );
};
