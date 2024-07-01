/* eslint-disable no-underscore-dangle */

"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getSubscriptionListAPI } from "@/apiCallers/managerSubscription";
import type { IPackagePurchase } from "@/interfaces/packagePurchase.interface";

import Tracking from "./Tracking";

const TrackingSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => getSubscriptionListAPI(),
  });

  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div className="mx-auto my-10 flex-col items-center gap-5">
      <div className="text-xl font-semibold">Tracking Subscriptions</div>
      <Tracking
        subscriptions={
          data?.data || ([] as (IPackagePurchase & { _id: string })[])
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default TrackingSubscription;
