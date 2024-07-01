import type { GetServerSideProps } from "next";

import { getSubscriptionListAPI } from "@/apiCallers/managerSubscription";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { managerId } = context.params as { managerId: string };

  try {
    const response = await getSubscriptionListAPI(managerId);

    console.log("Fetched Subscriptions:", response.data); // Log the fetched data

    if (!response.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        managerId,
        subscriptions: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error); // Log any errors
    return {
      props: {
        managerId,
        subscriptions: [],
        error: (error as Error).message || "Failed to fetch subscriptions",
      },
    };
  }
};
