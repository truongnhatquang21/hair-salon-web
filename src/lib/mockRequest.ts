import type { ResponseType } from "./error";

export const mockRequest = async <T>(sampleData: T): Promise<ResponseType> => {
  return new Promise<ResponseType<T>>((resolve) => {
    setTimeout(() => {
      resolve({ data: sampleData });
    }, 1000);
  });
};
