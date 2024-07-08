import { LayoutGrid, Settings } from "lucide-react";

import { RoleEnum } from "@/types";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role: RoleEnum): Group[] {
  switch (role) {
    case RoleEnum.ADMIN:
      return [
        {
          groupLabel: "",
          menus: [
            {
              href: "/dashboard",
              label: "Dashboard",
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // admin
        {
          groupLabel: "Account management",
          menus: [
            {
              href: "/dashboard/operators",
              label: "Operators",
              active: pathname.includes("/dashboard/operators"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/managers",
              label: "Managers",
              active: pathname.includes("/dashboard/managers"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/customers",
              label: "Customers",
              active: pathname.includes("/dashboard/customers"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },

        {
          groupLabel: "Requested branches",
          menus: [
            {
              href: "/dashboard/requestedBranch",
              label: "Requested branches",
              active: pathname.includes("/dashboard/requestedBranch"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        {
          groupLabel: "Subscriptions Management",
          menus: [
            {
              href: "/dashboard/subscriptions",
              label: "Subscriptions",
              active: pathname.includes("/dashboard/subscriptions"),
              icon: LayoutGrid,
              submenus: [],
            },
            // {
            //   href: "/dashboard/history/tracking-subscription",
            //   label: "History",
            //   active: pathname.includes(
            //     "/dashboard/history/tracking-subscription"
            //   ),
            //   icon: LayoutGrid,
            //   submenus: [],
            // },
          ],
        },
        {
          groupLabel: "Settings",
          menus: [
            {
              href: "/dashboard/account",
              label: "Account",
              active: pathname.includes("dashboard/account"),
              icon: Settings,
              submenus: [],
            },
          ],
        },
      ];
    case RoleEnum.MANAGER:
      return [
        {
          groupLabel: "",
          menus: [
            {
              href: "/dashboard",
              label: "Dashboard",
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // manager
        {
          groupLabel: "Branches management",
          menus: [
            {
              href: "/dashboard/branches",
              label: "Branches",
              active: pathname.includes("/dashboard/branches"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // court manager
        {
          groupLabel: "Branch management",
          menus: [
            {
              href: "/dashboard/schedule",
              label: "Schedule",
              active: pathname.includes("/dashboard/schedule"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/check-in",
              label: "Check-in",
              active: pathname.includes("/dashboard/check-in"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/courts",
              label: "Courts",
              active: pathname.includes("/dashboard/courts"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/staffs",
              label: "Staffs",
              active: pathname.includes("/dashboard/staffs"),
              icon: LayoutGrid,
              submenus: [],
            },

            {
              href: "/dashboard/reports",
              label: "Reports",
              active: pathname.includes("/dashboard/reports"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        {
          groupLabel: "Subscriptions Management",
          menus: [
            {
              href: "/dashboard/history/tracking-subscription",
              label: "History",
              active: pathname.includes(
                "/dashboard/history/tracking-subscription"
              ),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // general
        {
          groupLabel: "Settings",
          menus: [
            {
              href: "/dashboard/account",
              label: "Account",
              active: pathname.includes("dashboard/account"),
              icon: Settings,
              submenus: [],
            },
          ],
        },
      ];
    case RoleEnum.OPERATOR:
      return [
        {
          groupLabel: "",
          menus: [
            {
              href: "/dashboard",
              label: "Dashboard",
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // admin
        {
          groupLabel: "Account management",
          menus: [
            {
              href: "/dashboard/managers",
              label: "Managers",
              active: pathname.includes("/dashboard/managers"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/customers",
              label: "Customers",
              active: pathname.includes("/dashboard/customers"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },

        {
          groupLabel: "Requested branches",
          menus: [
            {
              href: "/dashboard/requestedBranch",
              label: "Requested branches",
              active: pathname.includes("/dashboard/requestedBranch"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        {
          groupLabel: "Subscriptions Management",
          menus: [
            {
              href: "/dashboard/subscriptions",
              label: "Subscriptions",
              active: pathname.includes("/dashboard/subscriptions"),
              icon: LayoutGrid,
              submenus: [],
            },
            // {
            //   href: "/dashboard/history/tracking-subscription",
            //   label: "History",
            //   active: pathname.includes(
            //     "/dashboard/history/tracking-subscription"
            //   ),
            //   icon: LayoutGrid,
            //   submenus: [],
            // },
          ],
        },
        {
          groupLabel: "Settings",
          menus: [
            {
              href: "/dashboard/account",
              label: "Account",
              active: pathname.includes("dashboard/account"),
              icon: Settings,
              submenus: [],
            },
          ],
        },
      ];
    case RoleEnum.STAFF:
      return [
        {
          groupLabel: "",
          menus: [
            {
              href: "/dashboard",
              label: "Dashboard",
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // manager

        // court manager
        {
          groupLabel: "Branch management",
          menus: [
            {
              href: "/dashboard/schedule",
              label: "Schedule",
              active: pathname.includes("/dashboard/schedule"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/check-in",
              label: "Check in",
              active: pathname.includes("/dashboard/check-in"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/courts",
              label: "Courts",
              active: pathname.includes("/dashboard/courts"),
              icon: LayoutGrid,
              submenus: [],
            },
            {
              href: "/dashboard/staffs",
              label: "Staffs",
              active: pathname.includes("/dashboard/staffs"),
              icon: LayoutGrid,
              submenus: [],
            },

            {
              href: "/dashboard/reports",
              label: "Reports",
              active: pathname.includes("/dashboard/reports"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        // general
        {
          groupLabel: "Settings",
          menus: [
            {
              href: "/dashboard/account",
              label: "Account",
              active: pathname.includes("dashboard/account"),
              icon: Settings,
              submenus: [],
            },
          ],
        },
      ];
    default:
      return [
        {
          groupLabel: "",
          menus: [
            {
              href: "/dashboard",
              label: "Dashboard",
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: [],
            },
          ],
        },
        {
          groupLabel: "Settings",
          menus: [
            {
              href: "/dashboard/account",
              label: "Account",
              active: pathname.includes("dashboard/account"),
              icon: Settings,
              submenus: [],
            },
          ],
        },
      ];
  }
  // return [
  //   {
  //     groupLabel: "",
  //     menus: [
  //       {
  //         href: "/dashboard",
  //         label: "Dashboard",
  //         active: pathname.includes("/dashboard"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   // admin
  //   {
  //     groupLabel: "Account management",
  //     menus: [
  //       {
  //         href: "/dashboard/operators",
  //         label: "Operators",
  //         active: pathname.includes("/dashboard/operators"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //       {
  //         href: "/dashboard/managers",
  //         label: "Managers",
  //         active: pathname.includes("/dashboard/managers"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //       {
  //         href: "/dashboard/customers",
  //         label: "Customers",
  //         active: pathname.includes("/dashboard/customers"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },

  //   {
  //     groupLabel: "Requested branches",
  //     menus: [
  //       {
  //         href: "/dashboard/requestedBranch",
  //         label: "Requested branches",
  //         active: pathname.includes("/dashboard/requestedBranch"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   {
  //     groupLabel: "Subscriptions Management",
  //     menus: [
  //       {
  //         href: "/dashboard/subscriptions",
  //         label: "Subscriptions",
  //         active: pathname.includes("/dashboard/subscriptions"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //       {
  //         href: "/dashboard/history/tracking-subscription",
  //         label: "History",
  //         active: pathname.includes("/dashboard/history/tracking-subscription"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   // manager
  //   {
  //     groupLabel: "Branches management",
  //     menus: [
  //       {
  //         href: "/dashboard/branches",
  //         label: "Branches",
  //         active: pathname.includes("/dashboard/branches"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   // court manager
  //   {
  //     groupLabel: "Branch management",
  //     menus: [
  //       {
  //         href: "/dashboard/courts",
  //         label: "Courts",
  //         active: pathname.includes("/dashboard/courts"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //       {
  //         href: "/dashboard/staffs",
  //         label: "Staffs",
  //         active: pathname.includes("/dashboard/staffs"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },

  //       {
  //         href: "/dashboard/reports",
  //         label: "Reports",
  //         active: pathname.includes("/dashboard/reports"),
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   // general
  //   {
  //     groupLabel: "Settings",
  //     menus: [
  //       {
  //         href: "/dashboard/account",
  //         label: "Account",
  //         active: pathname.includes("dashboard/account"),
  //         icon: Settings,
  //         submenus: [],
  //       },
  //     ],
  //   },
  // ];
}
