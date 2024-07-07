import create from "zustand";

import type { BranchSchemaTypeWithId } from "@/apiCallers/Branches";

type BranchStore = {
  branch: BranchSchemaTypeWithId | null;
  setBranch: (branch: BranchSchemaTypeWithId | null) => void;
};

const useBranchStore = create<BranchStore>((set) => ({
  branch: null,
  setBranch: (branch) => set(() => ({ branch })),
}));

export { useBranchStore };
