import React from "react";

import { TransactionList } from "@/components/TransactionList";
import { Separator } from "@/components/ui/separator";

const HistoryPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium">Transaction History</h3>
        <span className="text-sm text-muted-foreground">
          View transaction history of your account
        </span>
      </div>
      <Separator />
      <TransactionList />
    </div>
  );
};

export default HistoryPage;
