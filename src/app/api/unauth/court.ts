import type ICourt from "@/types/court";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_COURT_SEARCHED;
export const getAllSearchedCourt = async (): Promise<ICourt[]> => {
  const res = await fetch(`${baseUrl}`, { cache: "no-store" });
  const court = await res.json();
  return court;
};
