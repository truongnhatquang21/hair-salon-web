"use server";

import { signIn, signOut } from "@/auth";

// ...

// eslint-disable-next-line consistent-return
// export async function authenticate(formData: FormData | any) {
//   try {
//     const res = await signIn("credentials", {
//       ...formData,
//       redirect: false,
//     });
//     return res;
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return "Invalid credentials.";
//         default:
//           return "Something went wrong.";
//       }
//     }
//     throw error;
//   }
// }
export async function signInServer(formData: any) {
  await signIn("credentials", formData);
}

export async function signOutServer() {
  await signOut();
}
