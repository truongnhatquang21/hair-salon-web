import type { IPackageCourt } from "./PackageCourt";

export type ITrackingSubscription = {
  _id: string;
  totalPrice: number;
  totalCourt: number;
  duration: number;
  priceEachCourt: number;
  startDate: string;
  endDate: string;
  status: string;
  manager: string;
  packageCourt: IPackageCourt;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
