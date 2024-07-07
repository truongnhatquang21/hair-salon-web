"use server";

import { toast } from "@/components/ui/use-toast";
import { responseMapping } from "@/lib/error";
import { Env } from "@/libs/Env.mjs";
import type { ChangePasswordSchemaType } from "@/views/account/Account";

import { fetcher } from ".";

export interface IResponseToken {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export type CredentialsArgument = Partial<
  Record<"email" | "password", unknown>
>;
export const signIngApi = async ({ email, password }: CredentialsArgument) => {
  console.log("email", email, "password", password, "singnInApi");

  const response = await fetch(`${Env.SERVER_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  const transformedResult = responseMapping(result);
  transformedResult.status = response.status;
  transformedResult.ok = response.ok;

  if (!transformedResult.ok) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: transformedResult.message || transformedResult.statusText,
    });
    // throw new Error(data.message || data.statusText);
  }
  if (transformedResult.message) {
    return toast({
      variant: "default",
      className: "bg-green-600 text-white",
      title: "Message from system",
      description: transformedResult.message,
    });
  }
  return result;
};
export const getProfileApi = async (accessToken: string) => {
  const response = await fetch(`${Env.SERVER_URL}auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });
  const result = await response.json();
  const transformedResult = responseMapping(result);
  transformedResult.status = response.status;
  transformedResult.ok = response.ok;

  return result;
};

export const changePasswordApi = async (data: ChangePasswordSchemaType) => {
  return fetcher("user/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
