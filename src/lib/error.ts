export type ResponseType<T = any> = {
  message?: string;
  error?: { [key: string]: { message: string } };
  status?: number;
  data?: T;
  ok?: boolean;
  statusText?: string;
};

export const responseMapping = (response: any): ResponseType => {
  // console.log("line 11: ", response);

  const result: { [key: string]: any } = {};
  if (response.message) {
    result.message = response.message;
  }
  if (response.error) {
    const errorMap: { [key: string]: { message: string } } = {};
    response.error.forEach((error: { message: string; path: string[] }) => {
      if (typeof error.path[1] === "string") {
        const index = error.path[1] as string;
        errorMap[index] = { message: error.message };
      }
    });
    result.error = errorMap;
  }
  if (response.status) {
    result.statusText = response.status;
  }
  if (response.data) {
    result.data = response.data;
  }

  if (response.accessToken) {
    result.accessToken = response.accessToken;
    result.refreshToken = response.refreshToken;
  }
  return result;
};
