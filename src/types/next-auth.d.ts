import type { RoleEnum } from ".";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      // name: string;
      // email: string;
      // image: string;

      // Custom fields
      role: RoleEnum;
    };
  }
}