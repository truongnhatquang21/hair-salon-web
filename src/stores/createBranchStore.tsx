"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export type StoreStep = {
  step: number;
  data: Object;
};
export type BranchStepState = {
  stepStore: StoreStep[];
};

export type BranchStepActions = {
  setStore: (data: StoreStep) => void;
  resetStore: () => void;
};

export type BranchStepStore = BranchStepActions & BranchStepState;

export const defaultInitState: BranchStepState = {
  stepStore: [],
};

export const createBranchStepStore = (
  initState: BranchStepState = defaultInitState
) => {
  return createStore<BranchStepStore>()((set) => ({
    ...initState,
    setStore: (data) =>
      set((state) => {
        const existStep = state.stepStore.find(
          (item) => item.step === data.step
        );
        if (existStep) {
          existStep.data = data.data;
        } else {
          state.stepStore.push(data);
        }
        return { ...state };
      }),
    resetStore: () => set(defaultInitState),
  }));
};
export type BranchStepStoreApi = ReturnType<typeof createBranchStepStore>;

export const BranchStepStoreContext = createContext<
  BranchStepStoreApi | undefined
>(undefined);

export interface BranchStepStoreProviderProps {
  children: ReactNode;
}

export const BranchStepStoreProvider = ({
  children,
}: BranchStepStoreProviderProps) => {
  const storeRef = useRef<BranchStepStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createBranchStepStore();
  }

  return (
    <BranchStepStoreContext.Provider value={storeRef.current}>
      {children}
    </BranchStepStoreContext.Provider>
  );
};

export const useBranchStepStore = <T,>(
  selector: (store: BranchStepStore) => T
): T => {
  const context = useContext(BranchStepStoreContext);

  if (!context) {
    throw new Error(
      `useBranchStepStore must be used within BranchStepStoreProvider`
    );
  }

  return useStore(context, selector);
};
