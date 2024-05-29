import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import apiCallers from "./apiCallers";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          // const { email, password } = parsedCredentials.data;
          // Replace this with your own authentication logic

          const res = await apiCallers.post<typeof parsedCredentials.data>(
            "sign-in",
            parsedCredentials.data
          );
          return res;
        }
        return null;
      },
    }),
  ],
});
