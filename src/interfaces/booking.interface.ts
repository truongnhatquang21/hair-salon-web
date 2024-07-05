import type { ICourt } from "./court.interface";
import type { IUser } from "./user.interface";

export interface IBooking {
  _id?: string;
  type: string;
  paymentType: string;
  paymentMethod: string;
  totalPrice: number;
  totalHour: number;
  startDate: string;
  endDate: string;
  status: string;
  court: ICourt | string;
  customer?: string | IUser;
}
