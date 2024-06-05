// eslint-disable-next-line
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import type { NavItem } from "@/types/nav";
import type { Session } from "next-auth";

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();
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
      <MainNav items={NavItems} session={session as Session} />
      <div className="flex-1 p-2">{props.children}</div>
      <Footer />
    </div>
  );
}
