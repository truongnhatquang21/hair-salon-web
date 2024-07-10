import type { ISlot } from "@/interfaces/slot.interface";
import type ICourt from "@/types/Court";

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

export function calculateTotalPrice(
  slots: ISlot[],
  courtPrice: number
): number {
  let sum = 0;
  for (const slot of slots) {
    sum += (1 + slot.surcharge) * courtPrice;
  }
  return sum;
}
export function calculateTotalPricePerCourt(
  slots: ISlot[],
  courts: ICourt[]
): number {
  const results = [];
  for (const court of courts) {
    let sum = 0;
    const courtPrice = court.price; // Replace with your logic to get the price for each court

    for (const slot of slots) {
      sum += (1 + slot.surcharge) * courtPrice;
    }
    results.push({ court, totalPrice: sum });
  }
  const totalPrice = results.reduce(
    (acc, current) => acc.totalPrice + current.totalPrice,
    0
  );
  return totalPrice;
}
