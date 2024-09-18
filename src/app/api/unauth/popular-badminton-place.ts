import type Ibadminton from '@/types/badminton';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_POPULAR_badminton_PLACE;
export const getAllbadminton = async (): Promise<Ibadminton[]> => {
  const res = await fetch(`${baseUrl}`, { cache: 'no-store' });
  const badminton = await res.json();
  return badminton;
};
