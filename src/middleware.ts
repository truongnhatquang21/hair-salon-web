/* eslint-disable consistent-return */
// import { defaultLocale, localePrefix, locales } from "./messages/config";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { auth } from "./auth";
import { RoleEnum } from "./types";
// import { authOptions } from "./app/api/auth/[...nextauth]/route";
import { AppConfig } from "./utils/AppConfig";

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

// export default NextAuth(authConfig).auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

const publicPages = [
  "/401",
  "/404",
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
  "/contact",
  "/about",
  "/help",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/end-user-license-agreement",
  "/subscriptions",
  "/tracking",
  "/search",
  "/checkIn",
];
const commonAuthPages = [
  "/subscriptions/order/[slug]",
  "/branch/[slug]",
  "/booking",
  "/subscriptions/order/[slug]/checkout",
];
const customerPages = [
  ...commonAuthPages,
  "/me/account",
  "/me/schedule",
  "/me/receipts",
  "/me/booking",
  "/me/history",
];
const adminPages = [
  ...commonAuthPages,
  "/dashboard",
  "/dashboard/operators",
  "/dashboard/managers",
  "/dashboard/customers",
  "/dashboard/requestedBranch",
  "/dashboard/requestedBranch/[branchId]",
  "/dashboard/subscriptions",
  "/dashboard/account",
];
const operatorPages = [
  ...commonAuthPages,
  "/dashboard",
  "/dashboard/managers",
  "/dashboard/customers",
  "/dashboard/requestedBranch",
  "/dashboard/requestedBranch/[branchId]",
  "/dashboard/subscriptions",
  "/dashboard/account",
];

const managerPages = [
  ...commonAuthPages,
  "/dashboard/check-in",
  "/dashboard",
  "/dashboard/branches",
  "/dashboard/branches/[branchId]",
  "/dashboard/branches/create",
  "/dashboard/history/tracking-subscription",
  "/dashboard/courts",
  "/dashboard/staffs",
  "/dashboard/reports",
  "/dashboard/account",
  "/dashboard/schedule",
];
const staffPages = [
  ...commonAuthPages,
  "/dashboard/check-in",
  "/dashboard",
  "/dashboard/courts",
  "/dashboard/staffs",
  "/dashboard/reports",
  "/dashboard/account",
  "/dashboard/schedule",
];
const authMiddleware = auth((req) => {
  const session = req.auth;
  const role = session?.user?.role;
  console.log("role", role, req.nextUrl.pathname);
  console.log(managerPages.includes(req.nextUrl.pathname), "ODOSF");
  if (true) {
    if (adminPages.includes(req.nextUrl.pathname)) {
      if (role === RoleEnum.ADMIN) {
        return intlMiddleware(req);
      }
      if (!role) return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    if (operatorPages.includes(req.nextUrl.pathname)) {
      if (role === RoleEnum.OPERATOR) {
        return intlMiddleware(req);
      }
      if (!role) return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    if (managerPages.includes(req.nextUrl.pathname)) {
      if (role === RoleEnum.MANAGER) {
        return intlMiddleware(req);
      }
      if (!role) return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    if (staffPages.includes(req.nextUrl.pathname)) {
      if (role === RoleEnum.STAFF) {
        return intlMiddleware(req);
      }
      if (!role) return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    if (customerPages.includes(req.nextUrl.pathname)) {
      if (role === RoleEnum.CUSTOMER) {
        return intlMiddleware(req);
      }
      if (!role) return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
  }
  const regex = {
    requestedBranch: {
      role: [RoleEnum.ADMIN, RoleEnum.OPERATOR],
      regex: /^\/dashboard\/requestedBranch\/[a-zA-Z0-9]+$/,
    },
    branches: {
      role: [RoleEnum.MANAGER],
      regex: /^\/dashboard\/branches\/[a-zA-Z0-9]+$/,
    },
    subscriptionOrder: {
      role: [RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.MANAGER],
      regex: /^\/subscriptions\/order\/([^/]+)$/,
    },
    subscriptionCheckout: {
      role: [RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.MANAGER],
      regex: /^\/subscriptions\/order\/([^/]+)\/checkout$/,
    },
    checkIn: {
      role: [RoleEnum.STAFF, RoleEnum.MANAGER],
      regex: /^\/dashboard\/check-in\/[a-zA-Z0-9]+$/,
    },
  };
  const { pathname } = req.nextUrl;

  switch (true) {
    case regex.requestedBranch.regex.test(pathname): {
      if (regex.requestedBranch.role.includes(role)) {
        return intlMiddleware(req);
      }

      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    case regex.branches.regex.test(pathname): {
      if (regex.branches.role.includes(role)) {
        return intlMiddleware(req);
      }
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    case regex.subscriptionOrder.regex.test(pathname): {
      if (regex.subscriptionOrder.role.includes(role)) {
        return intlMiddleware(req);
      }
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    case regex.subscriptionCheckout.regex.test(pathname): {
      if (regex.subscriptionCheckout.role.includes(role)) {
        return intlMiddleware(req);
      }
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    case regex.checkIn.regex.test(pathname): {
      if (regex.checkIn.role.includes(role)) {
        return intlMiddleware(req);
      }
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }
    default: {
      console.log("not found in auth pages");

      return NextResponse.redirect(new URL("/404", req.nextUrl));
    }
  }
});
export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${["en", "fr"].join("|")}))?(${publicPages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  console.log(req.nextUrl.pathname, "req.nextUrl.pathname");

  if (isPublicPage) {
    return intlMiddleware(req);
  }
  const path = req.nextUrl.pathname;
  const regex = {
    badminton: /^\/badminton\/[a-zA-Z0-9]+$/,
    article: /^\/article\/[a-zA-Z0-9]+$/,
    branch: /^\/branch\/[a-zA-Z0-9]+$/,
  };

  switch (true) {
    case regex.badminton.test(path): {
      return intlMiddleware(req);
    }
    case regex.article.test(path): {
      return intlMiddleware(req);
    }
    case regex.branch.test(path): {
      return intlMiddleware(req);
    }
    default: {
      {
        console.log("not found in public pages");

        return (authMiddleware as any)(req);
      }
    }
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
