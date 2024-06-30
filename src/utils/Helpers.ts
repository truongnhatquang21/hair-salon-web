export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export function getThu(date: Date): string {
  const day = date.getDay();

  let thu: string;
  switch (day) {
    case 0:
      thu = "Chủ nhật";

      break;
    case 1:
      thu = "thứ Hai";

      break;
    case 2:
      thu = "thứ Ba";

      break;
    case 3:
      thu = "thứ Tư";

      break;
    case 4:
      thu = "thứ Năm";

      break;
    case 5:
      thu = "thứ Sáu";
      break;
    case 6:
      thu = "thứ Bảy";

      break;
    default:
      thu = "error";
      break;
  }

  return thu;
}
