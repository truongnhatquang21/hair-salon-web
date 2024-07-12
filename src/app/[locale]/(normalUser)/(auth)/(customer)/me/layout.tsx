import { SidebarNav } from "@/components/CmsSideBar";

const sidebarNavItems = [
  {
    title: "Account",
    href: "/me/account",
  },
  {
    title: "Schedule",
    href: "/me/schedule",
  },
  {
    title: "Set Flexible Schedule",
    href: "/me/booking",
  },
  {
    title: "Booking receipts",
    href: "/me/receipts",
  },
  {
    title: "Transaction History",
    href: "/me/history",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className=" flex flex-col gap-2 p-2 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <span className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </span>
      </div>
      {/* <Separator className="my-2" /> */}
      <div className="flex w-full flex-col gap-4  rounded-md border border-dashed  p-4 shadow-sm lg:flex-row">
        <aside className=" rounded-md border-r pr-3 lg:w-1/5  ">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className=" max-h-screen flex-1 overflow-auto p-2">{children}</div>
      </div>
    </div>
  );
}
