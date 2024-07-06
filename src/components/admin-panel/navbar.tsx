"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  type BranchSchemaTypeWithId,
  getMyBranchListAPI,
} from "@/apiCallers/Branches";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { UserNav } from "@/components/admin-panel/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchStore } from "@/stores/branchStore";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { data } = useQuery({
    queryKey: ["myBranches"],
    queryFn: async () => getMyBranchListAPI(),
  });
  const selectedBranch = useBranchStore();
  const branches = data?.data;
  useEffect(() => {
    if (branches && branches.length > 0 && !selectedBranch.branch) {
      selectedBranch.setBranch(branches[0]);
    }
  }, [
    branches,
    selectedBranch.branch,
    selectedBranch.setBranch,
    selectedBranch,
  ]);

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center gap-4 space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
          <Select
            value={selectedBranch.branch?._id}
            onValueChange={(value) => {
              const branch = branches?.find((branch) => branch._id === value);
              selectedBranch.setBranch(branch as BranchSchemaTypeWithId);
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.map((branch) => (
                <SelectItem value={branch._id} key={branch._id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
