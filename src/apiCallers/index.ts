import { auth } from "@/auth";
import { responseMapping } from "@/lib/error";

export const fetcher = async (url: string, options?: RequestInit) => {
  const session = await auth();
  const accessToken = session?.accessToken;

  const res = await fetch(process.env.SERVER_URL + url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    // cache: "no-cache",
    ...options,
  });

  const result = await res.json();

  const transformedResult = responseMapping(result);
  transformedResult.status = res.status;
  transformedResult.ok = res.ok;
  return transformedResult;
};
