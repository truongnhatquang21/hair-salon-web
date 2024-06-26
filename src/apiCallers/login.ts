"use server";

import { responseMapping } from "@/lib/error";
import { Env } from "@/libs/Env.mjs";

export interface IResponseToken {
  message: string;
  accessToken: string;
  refreshToken: string;
}

type CredentialsArgument = Partial<Record<"email" | "password", unknown>>;
export const signIngApi = async ({ email, password }: CredentialsArgument) => {
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
  // const transformedResult = responseMapping(result);
  // transformedResult.status = response.status;
  // transformedResult.ok = response.ok;
  return result;
};
export const getProfileApi = async (accessToken: string) => {
  const response = await fetch(`${Env.SERVER_URL}auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  const transformedResult = responseMapping(result);
  transformedResult.status = response.status;
  transformedResult.ok = response.ok;
  return result;
};
