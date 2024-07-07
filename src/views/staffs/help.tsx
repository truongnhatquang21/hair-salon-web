import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
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
import { regexPhoneNumber } from "@/lib/regex";
import { GenderEnum, RoleEnum } from "@/types";

import BanButton from "./BanButton";
import DetailButton from "./DetailsButton";

export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export const createStaffSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be greater than 1 characters!" }),
  email: z
    .string()
    .min(1, { message: "Email must be greater than 1 characters!" })
    .email("This is not a valid email."),

  gender: z.nativeEnum(GenderEnum),
  firstName: z
    .string()
    .min(1, { message: "First name must be greater than 1 characters!" }),
  lastName: z
    .string()
    .min(1, { message: "Last Name must be greater than 1 characters!" }),
  phone: z
    .string()
    .min(1, { message: "Phone must be greater than 1 number!" })
    .max(10, { message: "Phone must be less than 10 number!" })
    .regex(regexPhoneNumber, { message: "Phone must be a valid phone" }),
  dob: z.coerce.date(),
  role: z.nativeEnum(RoleEnum),
  password: z.string(),
  status: z.nativeEnum(UserStatusEnum),
});

export type CreateStaffSchemaType = z.infer<typeof createStaffSchema>;
export type CreateStaffSchemaTypeWithId = CreateStaffSchemaType & {
  _id: string;
};
export const columns: ColumnDef<CreateStaffSchemaTypeWithId>[] = [
  {
    accessorKey: "username",
    id: "name",
    cell: ({ getValue, row }) => {
      const data = getValue() as string;
      return <span>{data || row.getValue("email")}</span>;
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="email" />;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Phone" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data || "--"}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Gender" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as GenderEnum;
      return <span>{data || "--"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="status" />;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />;
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="DOB" />;
    },
    cell: ({ getValue }) => {
      const data = getValue() as string;
      return <span>{data ? format(new Date(data), "yyyy-MM-dd") : "--"}</span>;
    },
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const data = row.original as CreateStaffSchemaTypeWithId;
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
                isView
              />
              {data.status === UserStatusEnum.ACTIVE && (
                <BanButton
                  id={data._id}
                  Trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="w-full text-destructive"
                    >
                      Ban this user
                    </DropdownMenuItem>
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
