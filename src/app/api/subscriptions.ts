import type { IResponse } from "@/types/Response";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const getManagerSubscription = async (
  managerId: string
): Promise<IResponse> => {
  const res = await fetch(
    `${baseUrl}package-purchase/get-purchases/${managerId}`,
    {
      cache: "no-store",
    }
  );
  const subscriptions = await res.json();
  console.log(subscriptions);
  return subscriptions;
};
