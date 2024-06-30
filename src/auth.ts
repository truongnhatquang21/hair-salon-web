/* eslint-disable no-param-reassign */

import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getProfileApi } from "./apiCallers/login";

// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password";

interface ExtendedUser extends User {
  message: string;
  accessToken: string;
  refreshToken: string;
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
        // accessToken: "" || {},
        // refreshToken: "" || {},
      },

      async authorize(credentials) {
        if (credentials === null) return null;

        const profile = await getProfileApi(credentials.email as string);
        if (profile.message) {
          throw new Error("Email or Password is not correct");
        }

        return {
          name: profile.user.username,
          email: profile.user.email,
          accessToken: credentials.email,
          refreshToken: credentials.password,
        } as ExtendedUser;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const extendUser: ExtendedUser = user as ExtendedUser;
      if (extendUser) {
        token.accessToken = extendUser.accessToken;
        token.refreshToken = extendUser.refreshToken;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.accessToken && token.refreshToken) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
});
