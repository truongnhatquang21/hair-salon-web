'use server';

import { fetcher } from '..';

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
