export type IPackageCourt = {
  _id: string;
  name: string;
  type: string;
  totalPrice: number | null;
  priceEachCourt: number;
  maxCourt: number | null;
  duration: number | null;
  description: string;
};
