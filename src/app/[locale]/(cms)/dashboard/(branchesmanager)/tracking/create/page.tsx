import React from "react";

import { BranchStepStoreProvider } from "@/stores/createBranchStore";
import { CreateView } from "@/views/branches/create/CreateView";

const page = () => {
  return (
    <div className="size-full overflow-auto">
      <BranchStepStoreProvider>
        <CreateView />
      </BranchStepStoreProvider>
    </div>
  );
};

export default page;
