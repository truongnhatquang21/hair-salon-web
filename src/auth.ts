import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { ApiCheck } from "checkly/constructs";
import apiCallers from "./apiCallers";
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
          try {
            const res = await apiCallers.post<typeof parsedCredentials.data>(
              "sign-in",
              parsedCredentials.data
            );
            return res;
          } catch (e) {
            throw e;
          }
        }
        return null;
      },
    }),
  ],
});
