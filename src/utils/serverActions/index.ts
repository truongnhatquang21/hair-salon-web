"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
// ...

// eslint-disable-next-line consistent-return
export async function authenticate(formData: FormData | any) {
  try {
    const res = await signIn("Credentials", {
      ...formData,
      redirectTo: "/",
    });
    return res;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
export async function signOutFn() {
  await signOut();
}
