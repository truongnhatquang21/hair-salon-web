"use server";

import { fetcher } from "..";

export type AuthType = {
  username: string;
  password: string;
  email: string;
};

export const signUpCustomerAPI = async (data: AuthType) => {
  return fetcher("customer/create", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });
};

export const signUpManagerAPI = (data: AuthType) => {
  return fetcher("manager", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });
};

export const signInAPI = (data: Omit<AuthType, "username">) => {
  return fetcher("auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });
};
