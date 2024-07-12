// eslint-disable-next-line
import { auth } from "@/auth";
import Footer from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import type { NavItem } from "@/types/nav";
import type { Session } from "next-auth";

function Component() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This platform only supports devices with a screen size of 768px or
          larger.
        </h1>
        <p className="mt-4 text-muted-foreground">
          We apologize for the inconvenience, but our platform is currently
          optimized for larger screens. Please try accessing this page from a
          device with a screen size of 768px or larger.
        </p>
        {/* <div className="mt-6">
          <Link
            href="#"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Homepage
          </Link> */}
        {/* </div> */}
      </div>
    </div>
  );
}
export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();
  // const t = useTranslations("RootLayout");
  const NavItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },

    {
      title: "Subscriptions",
      href: "/subscriptions",
    },
  ];
  return (
    <>
      <div className="mx-auto hidden min-h-screen w-full max-w-[1350px] flex-col border-x border-dashed md:flex ">
        <MainNav items={NavItems} session={session as Session} />
        <div className="p-2 py-4">{props.children}</div>
        <Footer />
      </div>
      <div className="hidden h-screen w-screen max-md:block">
        <Component />
      </div>
    </>
  );
}

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3KiXhX461S5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
