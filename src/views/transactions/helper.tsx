import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { z } from "zod";

import { formatToVND } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/helper";
import { DataTableColumnHeader } from "@/components/table/ColumnHeader";
import { cn } from "@/lib/utils";
import { TransactionTypeEnum } from "@/types";

import type { CreateCustomerSchemaTypeWithId } from "../customer/helper";

const paymentSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountBank: z.string(),
  expDate: z.date().optional(),
});
export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum PaymentMethodEnum {
  LINKED_ACCOUNT = "Linked Account",
  MANUAL_ENTRY = "Manual Entry",
}

export type TransactionTypeWithId = {
  from: CreateCustomerSchemaTypeWithId;
  to: CreateCustomerSchemaTypeWithId;
  _id: string;
  amount: number;
  type: TransactionTypeEnum;
  paymentMethod: PaymentMethodEnum;
  payment: z.infer<typeof paymentSchema> & {
    _id: string;
  };
  createdAt: string;
};
export const columns: ColumnDef<TransactionTypeWithId>[] = [
  {
    accessorKey: "from",
    accessorFn: (data) => data.from?.email,
    id: "name",
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data || "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="From" />;
    },
  },
  {
    accessorKey: "to",
    accessorFn: (data) => data.to?.email,
    id: "to",
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data || "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="To" />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
    cell: ({ getValue, row }) => {
      const fulldata = row.original as TransactionTypeWithId;

      const data = getValue() as number;
      return (
        <span
          className={cn(
            fulldata?.type === TransactionTypeEnum.REFUND
              ? "text-green-500"
              : "text-red-500",
            "font-semibold text-left flex items-center flex-nowrap text-nowrap"
          )}
        >
          {fulldata.type === TransactionTypeEnum.REFUND ? "+" : "-"}{" "}
          {formatToVND(data) || "--"}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data || "--"}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Payment Method" />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data ? format(new Date(data), "Ppp") : "--"}</span>;
    },
  },
  // {
  //   accessorKey: "payment",

  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title="Payment" />;
  //   },
  //   cell: ({ getValue }) => {
  //     const data = getValue() as z.infer<typeof paymentSchema>;
  //     return (
  //       <span>
  //         {data ? `${data.accountNumber?.slice(0, 4)}***** ***** **` : "--"}
  //       </span>
  //     );
  //   },
  // },
];
