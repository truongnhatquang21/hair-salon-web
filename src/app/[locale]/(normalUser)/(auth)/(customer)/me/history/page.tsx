import React from "react";

import { TransactionList } from "@/components/TransactionList";
import { Separator } from "@/components/ui/separator";

const HistoryPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium">Balance History</h3>
        <span className="text-sm text-muted-foreground">
          view balance history of your account
        </span>
      </div>
      <Separator />
      <TransactionList />
    </div>
  );
};

export default HistoryPage;
