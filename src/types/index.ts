import { type ClientUploadedFileData } from 'uploadthing/types';

export type CreateUSerType = {
  email: string;
  password: string;
  username: string;
};

export enum RoleEnum {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  MANAGER = 'Manager',
  STAFF = 'Staff',
  STYLIST = 'Stylist',
}

export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum UserStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  // PENDING = "Pending",
}

export enum TransactionTypeEnum {
  REFUND = 'Refund',
  BOOKING = 'Booking',
  PACKAGE = 'Package',
  ADD_COURT = 'Add Court',
}

export enum CourtReportStatus {
  AVAILABLE = 'Available',
  WARN = 'Warn',
  MAINTENANCE_NEEDED = 'Maintenance needed',
  PENDING = 'Pending',
  DENIED = 'Denied',
}

export enum BranchStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DENIED = 'Denied',
}

export enum CourtStatusEnum {
  PENDING = 'Pending',
  INUSE = 'Inuse',
  TERMINATION = 'Termination',
}

export enum BookingStatusEnum {
  PENDING = 'Pending',
  BOOKED = 'Booked',
  CANCELLED = 'Cancelled',
  DONE = 'Done',
}

export enum BookingTypeEnum {
  SINGLE_SCHEDULE = 'single_schedule',
  PERMANENT_SCHEDULE = 'permanent_schedule',
  FLEXIBLE_SCHEDULE = 'flexible_schedule',
}

export enum ScheduleStatusEnum {
  AVAILABLE = 'Available',
  DONE = 'Done',
  CANCELLED = 'Cancelled',
}

export enum PackageCourtTypeEnum {
  CUSTOM = 'Custom',
  STANDARD = 'Standard',
}
export enum WeekDayEnum {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}
