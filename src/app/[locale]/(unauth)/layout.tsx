"use client";

import Footer from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import type { NavItem } from "@/types/nav";

// eslint-disable-next-line

export default function Layout(props: { children: React.ReactNode }) {
  // const t = useTranslations("RootLayout");
  const NavItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Activity",
      href: "#activity",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/#contact",
    },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainNav items={NavItems} />
      <div className="flex-1">{props.children}</div>
      <Footer />
    </div>
  );
}
