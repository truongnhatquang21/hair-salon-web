import type IBranch from "@/types/branch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_BRANCH_SEARCHED;

export const getAllSearchedBranch = async (
  page: number,
  limit: number,
  _params: {
    address: string;
    date: string;
    time: string;
    type: string;
    showStatusBar: boolean;
    showActivityBar: boolean;
    showPanel: boolean;
  }
): Promise<{ items: IBranch[]; total: number }> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  // const queryParams = new URLSearchParams({
  //   page: page.toString(),
  //   limit: limit.toString(),
  //   address: params.address,
  //   date: params.date,
  //   time: params.time,
  //   type: params.type,
  //   showStatusBar: params.showStatusBar.toString(),
  //   showActivityBar: params.showActivityBar.toString(),
  //   showPanel: params.showPanel.toString(),
  // });

  // const res = await fetch(`${baseUrl}?${queryParams.toString()}`, {
  //   cache: "no-store",
  // });
  const res = await fetch(`${baseUrl}?${queryParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch branches");
  }

  const data = await res.json();

  return {
    items: data,
    total: 56, // Change to correct number when use exact api
  };
};
