import type IBadminton from "@/types/badminton";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_POPULAR_BADMINTON_PLACE;
export const getAllBadminton = async (): Promise<IBadminton[]> => {
  const res = await fetch(`${baseUrl}`, { cache: "no-store" });
  const badminton = await res.json();
  return badminton;
};
