import React from "react";

import { AccountAutoForm } from "@/components/Account/AccountForm";

type Props = {};

const Account = (props: Props) => {
  return (
    <div className="relative flex h-full max-w-xl flex-col gap-4 overflow-auto ">
      <h1 className="text-2xl font-semibold">Setting account</h1>
      <div className="relative flex-1 overflow-auto p-4">
        <AccountAutoForm />
      </div>
    </div>
  );
};

export default Account;
