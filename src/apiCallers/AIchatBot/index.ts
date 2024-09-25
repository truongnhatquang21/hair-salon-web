import { responseMapping } from '@/lib/error';

const fetcher = async <T>(
  url: string,
  options?: RequestInit,
  baseUrl?: string
) => {
  const res = await fetch((baseUrl || process.env.SERVER_URL) + url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',

    ...options,
  });

  const result = await res.json();
  if (baseUrl) {
    return result;
  }
  console.log('result', result);
  console.log('Response OK', res);
  const transformedResult = responseMapping<T>(result);
  transformedResult.status = res.status;
  transformedResult.ok = res.ok;

  return transformedResult;
};

const URL = process.env.NEXT_PUBLIC_AI_ULR;
type Res = {
  query: string;
  result: string;
};
export const getAIAnswer = async (question: string) => {
  const res = await fetcher<Res>(
    '',
    {
      body: JSON.stringify(question),
      method: 'POST',
    },
    URL
  );
  console.log('res', res);
  return res;
};
