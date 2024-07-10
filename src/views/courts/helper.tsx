import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";

import { getProfileAPI } from "@/apiCallers/auth";
import { formatToVND } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/helper";
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
import { useBranchStore } from "@/stores/branchStore";
import { BranchStatusEnum, CourtStatusEnum } from "@/types";

import CreateCourtButton from "./CreateCourtButton";

export const createCourtObject = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be greater than 1 characters!" }),
  type: z
    .string()
    .min(1, { message: "Type must be greater than 1 characters!" }),
  price: z
    .number()
    .gte(1000, "price must be more than 1.000")
    .lte(100000000, "price must be less than 100.000.000"),
  description: z
    .string()
    .min(1, { message: "Description must be greater than 1 characters!" })
    .optional(),
  images: z.any(),
  status: z.nativeEnum(CourtStatusEnum),
});

export type CourtSchemaType = z.infer<typeof createCourtObject>;
export type CourtSchemaTypeWithId = CourtSchemaType & {
  _id: string;
};

export const columns: ColumnDef<CourtSchemaTypeWithId>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const img = row.getValue("images") as string | File | StaticImport[];
      return (
        <Image
          src={img[0]}
          alt="branch"
          width={10}
          height={10}
          className="size-10 rounded-full object-cover"
        />
      );
    },
  },

  {
    accessorKey: "name",
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Court name" />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as number;
      return <span>{formatToVND(data)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data ? `${data.slice(0, 100)}...` : "-"}</span>;
    },
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const data = row.original as CourtSchemaTypeWithId;
      const selectedBranch = useBranchStore((state) => state.branch);
      const { data: profileData } = useQuery({
        queryKey: ["myProfile"],
        queryFn: async () => getProfileAPI(),
      });
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
              <CreateCourtButton
                onClose={() => setIsMenuOpen(false)}
                isEdit
                isView={
                  selectedBranch.status === BranchStatusEnum.DENIED ||
                  profileData?.data?.role !== "Manager"
                }
                defaultValues={data}
                ButtonTrigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {selectedBranch.status !== BranchStatusEnum.DENIED &&
                    profileData?.data?.role === "Manager"
                      ? "View and Update"
                      : "View"}
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
