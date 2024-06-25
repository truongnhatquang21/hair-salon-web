"use server";

import { Env } from "@/libs/Env.mjs";

export interface IResponseToken {
  message: string;
  accessToken: string;
  refreshToken: string;
}

type CredentialsArgument = Partial<Record<"email" | "password", unknown>>;
export const signIngApi = async ({ email, password }: CredentialsArgument) => {
  const response = await fetch(`${Env.SERVER_URL}auth/login`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};
export const getProfileApi = async (accessToken: string) => {
  const response = await fetch(`${Env.SERVER_URL}auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};
