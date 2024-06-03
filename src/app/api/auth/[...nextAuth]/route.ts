import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
  },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user;
  //     const isOnDashboard = nextUrl.pathname.startsWith("/profile");
  //     if (isOnDashboard) {
  //       if (isLoggedIn) return true;
  //       return false; // Redirect unauthenticated users to login page
  //     }
  //     if (isLoggedIn) {
  //       return Response.redirect(new URL("/profile", nextUrl));
  //     }
  //     return true;
  //   },
  // },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        return { id: 1, name: "J Smith" };
      },
    }),
  ],
} satisfies NextAuthConfig;
const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(authOptions);
export { auth, GET, POST, signIn, signOut };
