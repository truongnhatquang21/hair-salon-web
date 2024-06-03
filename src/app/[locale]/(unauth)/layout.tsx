// eslint-disable-next-line
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import type { NavItem } from "@/types/nav";

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();
  console.log("session", session);

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
      <MainNav items={NavItems} session={session} />
      <div className="flex-1">{props.children}</div>
      <Footer />
    </div>
  );
}
