"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import * as React from "react";

import { getProfileAPI } from "@/apiCallers/auth";
import { cn } from "@/lib/utils";
import logo from "@/public/assets/images/logo.png";
import { RoleEnum } from "@/types";
import type { NavItem } from "@/types/nav";
import { signOutServer } from "@/utils/serverActions";

import SpinnerIcon from "../SpinnerIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MainNavProps {
  items?: NavItem[];
  session?: Session;
}
export function MainNav({ items, session }: MainNavProps) {
  const pathname = usePathname();
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (!profileData?.ok && !profileData?.data && !session?.user) {
      router.push("/sign-in");
    }
  }, [profileData?.data]);
  return (
    <div className=" flex items-center gap-6 rounded-md  border-b  px-4 shadow-sm backdrop-blur-md md:gap-10">
      <Link
        href="/"
        className="flex items-center gap-0  border-r-2 border-foreground font-sans text-xl font-extrabold  "
      >
        <span className="relative -right-4 inline-block  uppercase ">
          Bookm
        </span>
        <Image
          src={logo}
          alt="logo"
          className="h-14 w-auto  rotate-180 object-contain "
        />
        <span className="relative -left-4 inline-block  uppercase ">nton </span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-4 py-6 md:gap-10">
          {items?.map(
            (item) =>
              item.href && (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "border-b-2 bod border-transparent  p-1 flex items-center text-sm transition-all ease-in-out duration-200 font-light ",
                    item.disabled && "cursor-not-allowed opacity-80",
                    item.href === pathname &&
                      "font-bold  scale-125 border-popover-foreground",
                    pathname.includes(item.href) &&
                      item.href !== "/" &&
                      "font-bold  scale-125 border-popover-foreground"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
      {isProfileLoading ? (
        <span className="ml-auto">
          <SpinnerIcon />
        </span>
      ) : !profileData?.data?.role ? (
        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant={pathname !== "/sign-up" ? "default" : "ghost"}
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>{" "}
          <Button
            asChild
            variant={pathname === "/sign-up" ? "default" : "ghost"}
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      ) : (
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 px-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium leading-none">
                    {`${profileData?.data?.firstName} ${profileData?.data?.lastName}`}
                  </span>
                  <span className="flex flex-col items-center gap-2 text-xs leading-none text-muted-foreground">
                    {profileData?.data?.email}{" "}
                    <Badge className="flex w-full justify-center text-center">
                      {profileData?.data?.role}
                    </Badge>
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              {profileData?.data?.role === RoleEnum.CUSTOMER && (
                <DropdownMenuItem asChild>
                  <Button variant="outline" asChild>
                    <Link href="/me/account">Profile and settings</Link>
                  </Button>
                </DropdownMenuItem>
              )}
              {session.user.role !== RoleEnum.CUSTOMER && (
                <DropdownMenuItem asChild>
                  <Button variant="default" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={async () => {
                    await signOutServer();
                    await queryClient.invalidateQueries({
                      queryKey: ["myProfile"],
                    });
                    router.push("/sign-in");
                  }}
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
