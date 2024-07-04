/* eslint-disable no-param-reassign */

"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import type { IBooking } from "@/interfaces/booking.interface";
import type { ISchedule } from "@/interfaces/schedule.interface";

export type BookingData = {
  booking: Omit<IBooking, "status"> | null;
  schedule: Omit<ISchedule, "status"> | null;
};
export type BookingDataState = {
  bookingData: BookingData;
};

export type BookingDataActions = {
  setBookingData: (data: BookingData) => void;
  resetBookingData: () => void;
};

export type BookingDataStore = BookingDataState & BookingDataActions;

export const defaultInitState: BookingDataState = {
  bookingData: {
    booking: null,
    schedule: null,
  },
};

export const bookingStore = (
  initState: BookingDataState = defaultInitState
) => {
  return createStore<BookingDataStore>()((set) => ({
    ...initState,
    setBookingData: (data) =>
      set((state) => {
        state.bookingData.booking = data.booking;
        state.bookingData.schedule = data.schedule;

        return { ...state };
      }),
    resetBookingData: () => set(defaultInitState),
  }));
};
export type BookingDataStoreApi = ReturnType<typeof bookingStore>;

export const BookingDataStoreContext = createContext<
  BookingDataStoreApi | undefined
>(undefined);

export interface BookingDataStoreProviderProps {
  children: ReactNode;
}

export const BookingDataStoreProvider = ({
  children,
}: BookingDataStoreProviderProps) => {
  const storeRef = useRef<BookingDataStoreApi>();
  if (!storeRef.current) {
    storeRef.current = bookingStore();
  }

  return (
    <BookingDataStoreContext.Provider value={storeRef.current}>
      {children}
    </BookingDataStoreContext.Provider>
  );
};

export const useBookingStore = <T,>(
  selector: (store: BookingDataStore) => T
): T => {
  const context = useContext(BookingDataStoreContext);

  if (!context) {
    throw new Error(
      `useBookingStore must be used within BookingDataStoreProvider`
    );
  }

  return useStore(context, selector);
};
