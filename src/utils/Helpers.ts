export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export function getThu(date: Date | undefined): string {
  const day = date?.getDay();

  let thu: string;
  switch (day) {
    case 0:
      thu = "Sunday";

      break;
    case 1:
      thu = "Monday";

      break;
    case 2:
      thu = "Tuesday";

      break;
    case 3:
      thu = "Wednesday";

      break;
    case 4:
      thu = "Thursday";

      break;
    case 5:
      thu = "Friday";
      break;
    case 6:
      thu = "Saturday";

      break;
    default:
      thu = "error";
      break;
  }

  return thu;
}
