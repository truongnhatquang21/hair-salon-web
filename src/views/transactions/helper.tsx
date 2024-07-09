import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { formatToVND } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/page";
import { DataTableColumnHeader } from "@/components/table/ColumnHeader";
import { type TransactionTypeEnum } from "@/types";

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
};
export const columns: ColumnDef<TransactionTypeWithId>[] = [
  {
    accessorKey: "from",
    accessorFn: (data) => data.from.email,
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
    accessorFn: (data) => data.from.email,
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
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{formatToVND(data) || "--"}</span>;
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
