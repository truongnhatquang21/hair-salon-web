import { auth } from "@/auth";
import { responseMapping } from "@/lib/error";

export default class ApiClient<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<U>(
    url: string,
    method: string,
    data?: T,
    headers?: { [key: string]: string }
  ): Promise<U> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as U;
  }

  // CRUD methods with basic type annotations
  async get<U>(url: string, headers?: { [key: string]: string }): Promise<U> {
    return this.fetch<U>(url, "GET", undefined, headers);
  }

  async post<U>(
    url: string,
    data: T,
    headers?: { [key: string]: string }
  ): Promise<U> {
    return this.fetch<U>(url, "POST", data, headers);
  }

  async put<U>(
    url: string,
    data: T,
    headers?: { [key: string]: string }
  ): Promise<U> {
    return this.fetch<U>(url, "PUT", data, headers);
  }

  async delete(
    url: string,
    headers?: { [key: string]: string }
  ): Promise<void> {
    return this.fetch<void>(url, "DELETE", undefined, headers);
  }
}

export const fetcher = async <T>(url: string, options?: RequestInit) => {
  const session = await auth();
  const accessToken = session?.accessToken;

  const res = await fetch(process.env.SERVER_URL + url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",

    ...options,
  });

  const result = await res.json();
  console.log("result", result);
  console.log("Response OK", res);
  const transformedResult = responseMapping<T>(result);
  transformedResult.status = res.status;
  transformedResult.ok = res.ok;

  return transformedResult;
};
