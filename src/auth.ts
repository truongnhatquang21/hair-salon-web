/* eslint-disable no-param-reassign */
import NextAuth, { AuthError, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getProfileApi, signIngApi } from "./apiCallers/login";

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
      },

      async authorize(credentials): Promise<User | null> {
        console.log("line 13dsafnsda,: ", credentials);

        if (credentials === null) return null;

        try {
          const account = await signIngApi(credentials);
          console.log(account);
          if (account) {
            const profile = await getProfileApi(account.accessToken);
            return {
              name: profile.username,
              email: profile.user.email,
              accessToken: account.accessToken,
              refreshToken: account.refreshToken,
              message: account.message,
            } as ExtendedUser;
          }
          throw new Error("User not found");
        } catch (error) {
          if (error instanceof AuthError) {
            switch (error.type) {
              case "CredentialsSignin":
                return { error: "Invalid credentials!" };
              default:
                return { error: "Something went wrong!" };
            }
          }

          throw error;
        }
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
