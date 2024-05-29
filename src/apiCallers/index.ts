import { Env } from "@/libs/Env.mjs";

class ApiClient<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<U>(url: string, method: string, data?: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as U;
  }

  // CRUD methods with basic type annotations
  async get<U>(url: string): Promise<U> {
    return this.fetch<U>(url, "GET");
  }

  async post<U>(url: string, data: T): Promise<U> {
    return this.fetch<U>(url, "POST", data);
  }

  async put<U>(url: string, data: T): Promise<U> {
    return this.fetch<U>(url, "PUT", data);
  }

  async delete(url: string): Promise<void> {
    return this.fetch<void>(url, "DELETE");
  }
}
export default new ApiClient(Env.SERVER_URL as string);
