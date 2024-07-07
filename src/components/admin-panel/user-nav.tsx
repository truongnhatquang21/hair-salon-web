"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";

import { getProfileAPI } from "@/apiCallers/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOutServer } from "@/utils/serverActions";

import { Badge } from "../ui/badge";

export function UserNav() {
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative size-8 rounded-full"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    alt="Avatar"
                    src="https://github.com/shadcn.png"
                  />
                  <AvatarFallback className="bg-transparent capitalize">
                    {profileData?.data?.firstName?.charAt(0) +
                      profileData?.data?.lastName?.charAt(1)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium leading-none">
              {`${profileData?.data?.firstName} ${profileData?.data?.lastName}`}
            </span>
            <span className="text-xs leading-none text-muted-foreground">
              {profileData?.data?.email}{" "}
              <Badge>{profileData?.data?.role}</Badge>
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="mr-3 size-4 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard/account" className="flex items-center">
              <User className="mr-3 size-4 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            signOutServer();
          }}
        >
          <LogOut className="mr-3 size-4 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
