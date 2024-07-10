"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getMyTransaction } from "@/apiCallers/trasaction";
import type { TransactionTypeWithId } from "@/views/transactions/helper";
import { columns } from "@/views/transactions/helper";

import { DataTable } from "./table/DataTable";

export function TransactionList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["TransactionList"],
    queryFn: async () => getMyTransaction(),
  });
  console.log(data, "dsd");
  const dataSort = useMemo(() => {
    if (!data?.data) return [];
    return data?.data?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data?.data]);
  return (
    <div className=" relative size-full overflow-auto">
      <DataTable
        navigation={false}
        canCreate={false}
        columns={columns}
        data={(dataSort || []) as TransactionTypeWithId[]}
        isLoading={isLoading}
      />
    </div>
  );
  //   <div className="space-y-8">
  //     <div className="flex items-center">
  //       <Avatar className="size-9">
  //         <AvatarImage src="/avatars/01.png" alt="Avatar" />
  //         <AvatarFallback>OM</AvatarFallback>
  //       </Avatar>
  //       <div className="ml-4 space-y-1">
  //         <span className="text-sm font-medium leading-none">
  //           Olivia Martin
  //         </span>
  //         <span className="text-sm text-muted-foreground">
  //           olivia.martin@email.com
  //         </span>
  //       </div>
  //       <div className="ml-auto font-medium">+$1,999.00</div>
  //     </div>
  //     <div className="flex items-center">
  //       <Avatar className="flex size-9 items-center justify-center space-y-0 border">
  //         <AvatarImage src="/avatars/02.png" alt="Avatar" />
  //         <AvatarFallback>JL</AvatarFallback>
  //       </Avatar>
  //       <div className="ml-4 space-y-1">
  //         <span className="text-sm font-medium leading-none">Jackson Lee</span>
  //         <span className="text-sm text-muted-foreground">
  //           jackson.lee@email.com
  //         </span>
  //       </div>
  //       <div className="ml-auto font-medium">+$39.00</div>
  //     </div>
  //     <div className="flex items-center">
  //       <Avatar className="size-9">
  //         <AvatarImage src="/avatars/03.png" alt="Avatar" />
  //         <AvatarFallback>IN</AvatarFallback>
  //       </Avatar>
  //       <div className="ml-4 space-y-1">
  //         <span className="text-sm font-medium leading-none">
  //           Isabella Nguyen
  //         </span>
  //         <span className="text-sm text-muted-foreground">
  //           isabella.nguyen@email.com
  //         </span>
  //       </div>
  //       <div className="ml-auto font-medium">+$299.00</div>
  //     </div>
  //     <div className="flex items-center">
  //       <Avatar className="size-9">
  //         <AvatarImage src="/avatars/04.png" alt="Avatar" />
  //         <AvatarFallback>WK</AvatarFallback>
  //       </Avatar>
  //       <div className="ml-4 space-y-1">
  //         <span className="text-sm font-medium leading-none">William Kim</span>
  //         <span className="text-sm text-muted-foreground">will@email.com</span>
  //       </div>
  //       <div className="ml-auto font-medium">+$99.00</div>
  //     </div>
  //     <div className="flex items-center">
  //       <Avatar className="size-9">
  //         <AvatarImage src="/avatars/05.png" alt="Avatar" />
  //         <AvatarFallback>SD</AvatarFallback>
  //       </Avatar>
  //       <div className="ml-4 space-y-1">
  //         <span className="text-sm font-medium leading-none">Sofia Davis</span>
  //         <span className="text-sm text-muted-foreground">
  //           sofia.davis@email.com
  //         </span>
  //       </div>
  //       <div className="ml-auto font-medium">+$39.00</div>
  //     </div>
  //   </div>
  // );
}
