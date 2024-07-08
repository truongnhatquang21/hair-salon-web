"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { formatToVND } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/page";
import { DataTableColumnHeader } from "@/components/table/ColumnHeader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateSubscriptionButton from "./CreateSubscriptionButton";
import DeleteSubsBtn from "./DeleteSubsBtn";

export enum PackageEnum {
  Custom = "Custom",
  Standard = "Standard",
}
export const createPackageCourtSchema = z.object({
  name: z.string(),
  type: z.string(),
  totalPrice: z.coerce.number().nullable().optional(),
  priceEachCourt: z.coerce.number().nullable().optional(),
  maxCourt: z.coerce.number().int().min(1).optional().nullable(),
  duration: z.coerce.number().int().min(1).optional().nullable(),
  description: z.string().optional(),
  status: z.string().optional(),
});
export enum PackageCourtStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export type PackageCourtSchemaType = z.infer<typeof createPackageCourtSchema>;
export type PackageCourtSchemaTypeWithId = PackageCourtSchemaType & {
  _id: string;
  status: PackageCourtStatusEnum;
};
export const columns: ColumnDef<PackageCourtSchemaTypeWithId>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "name",
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data}</span>;
    },
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Subscription name" />
      );
    },
  },
  {
    accessorKey: "totalPrice",
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{data ? formatToVND(data) : "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total price" />;
    },
  },
  {
    accessorKey: "priceEachCourt",
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{data ? formatToVND(data) : "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price/ court" />;
    },
  },
  {
    accessorKey: "maxCourt",
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{data || "-"}</span>;
    },

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Max court" />;
    },
  },
  {
    accessorKey: "duration",
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{data ? `${data} month(s)` : "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Duration" />;
    },
  },
  {
    accessorKey: "description",
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span className="">{`${data.slice(0, 100)}...` || "-"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
  },
  {
    accessorKey: "type",
    cell: ({ getValue }) => {
      const data = getValue() as PackageEnum;
      return <span>{data}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
  },
  {
    accessorKey: "status",
    cell: ({ getValue }) => {
      const data = getValue() as PackageCourtStatusEnum;
      return <span>{data}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const data = row.original as PackageCourtSchemaTypeWithId;
      return (
        <Dialog>
          <DropdownMenu
            open={isMenuOpen}
            onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <CreateSubscriptionButton
                onClose={() => setIsMenuOpen(false)}
                isEdit
                defaultValues={data}
                ButtonTrigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    View And Update
                  </DropdownMenuItem>
                }
              />

              <DeleteSubsBtn
                defalutValues={data}
                Trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="w-full text-destructive"
                  >
                    {data.status === PackageCourtStatusEnum.ACTIVE
                      ? "Deactivate"
                      : "Activate"}
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
export const sampleData = [
  {
    name: "Branch A",
    totalPrice: 1000,
    priceEachCourt: 100,
    maxCourt: 10,
    duration: 2,
    description: "This is a sample branch",
    type: PackageEnum.Standard,
  },
  {
    name: "Branch B",
    totalPrice: 1500,
    priceEachCourt: 150,
    maxCourt: 8,
    duration: 3,
    description: "This is another sample branch",
    type: PackageEnum.Standard,
  },
  {
    name: "Branch C",
    totalPrice: 2000,
    priceEachCourt: 200,
    maxCourt: 12,
    duration: 4,
    description: "This is a third sample branch",
    type: PackageEnum.Custom,
  },
  {
    name: "Branch D",
    totalPrice: 800,
    priceEachCourt: 80,
    maxCourt: 6,
    duration: 1,
    description: "This is a fourth sample branch",
    type: PackageEnum.Standard,
  },
  {
    name: "Branch E",
    totalPrice: 1200,
    priceEachCourt: 120,
    maxCourt: 9,
    duration: 2,
    description: "This is a fifth sample branch",
    type: PackageEnum.Custom,
  },
];
