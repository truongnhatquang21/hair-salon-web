import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

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
import type { GenderEnum } from "@/types";
import { CourtReportStatus } from "@/types";

import type { CourtSchemaTypeWithId } from "../courts/helper";
import type { CreateCustomerSchemaTypeWithId } from "../customer/helper";
import DeleteSubsBtn from "./DeleteSubsBtn";
import DetailButton from "./DetailsButton";

export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export const createReportSchema = z.object({
  creator: z.string().min(1, { message: "Creator is required" }),
  court: z.string().min(1, { message: "Court is required" }),
  images: z.any(),
  status: z.nativeEnum(CourtReportStatus),
  description: z.string().min(1, { message: "Description is required" }),
});

export type CreateReportSchemaType = z.infer<typeof createReportSchema>;
export type CreateReportSchemaTypeWithId = Omit<
  CreateReportSchemaType,
  "court" | "creator"
> & {
  _id: string;
  creator: CreateCustomerSchemaTypeWithId;
  court: CourtSchemaTypeWithId;
};
export const columns: ColumnDef<CreateReportSchemaTypeWithId>[] = [
  {
    accessorKey: "creator",
    id: "name",
    cell: ({ getValue }) => {
      const data = getValue() as CreateCustomerSchemaTypeWithId;
      return <span>{data?.email || "--"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Creator" />;
    },
  },
  {
    accessorKey: "creator",
    id: "role",
    cell: ({ getValue }) => {
      const data = getValue() as CreateCustomerSchemaTypeWithId;
      return <span>{data?.role || "--"}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />;
    },
  },
  {
    accessorKey: "court",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Court" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as CourtSchemaTypeWithId;
      return <span>{data.name || "--"}</span>;
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as GenderEnum;
      return <span>{data || "--"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const data = row.original as CreateReportSchemaTypeWithId;
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
              <DetailButton
                defaultValues={data}
                ButtonTrigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    View Details
                  </DropdownMenuItem>
                }
                isEdit
              />
              <DeleteSubsBtn
                id={data._id}
                Trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="w-full text-destructive"
                  >
                    Delete report
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
