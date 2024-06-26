import type ICourt from "@/types/court";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_COURT;
export const getAllSearchedCourt = async (): Promise<ICourt[]> => {
  const res = await fetch(`${baseUrl}`, { cache: "no-store" });
  const court = await res.json();
  return court;
};
export const getCourtById = async (id: string): Promise<ICourt> => {
  const res = await fetch(`${baseUrl}/${id}`, { cache: "no-store" });
  const court = await res.json();
  return court;
};
