import type { IPackageCourt } from "./PackageCourt";

export type IPurchasePackage = {
  _id: string;
  totalPrice: number;
  totalCourt: number;
  duration: number;
  priceEachCourt: number;
  startDate: string;
  endDate: string;
  manager: string;
  packageCourt: IPackageCourt;
  createdAt: string;
  updatedAt: string;
};
