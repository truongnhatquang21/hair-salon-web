/* eslint-disable no-underscore-dangle */

"use client";

import { format } from "date-fns";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

import { getSubscriptionListAPI } from "@/apiCallers/managerSubscription";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IPurchasePackage } from "@/types/PackagePurchase";

// Define the props for the component
type TrackingSubscriptionProps = {
  managerId: string;
};

const TrackingSubscription: React.FC<TrackingSubscriptionProps> = ({
  managerId,
}) => {
  // State for storing subscriptions data
  const [subscriptions, setSubscriptions] = useState<IPurchasePackage[]>([]);

  const [loading, setLoading] = useState<boolean>(false); // Set to false for static data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const data = await getSubscriptionListAPI(managerId);
        setSubscriptions(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [managerId]);
  // Show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Show error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mx-auto my-10 flex-col items-center gap-5">
      <div className="text-xl font-semibold">Tracking Subscriptions</div>
      <div className="flex w-full flex-wrap justify-between gap-3">
        {subscriptions.map((subscription) => (
          <div
            key={subscription._id}
            className="flex w-5/12 flex-col gap-2 rounded-md border-2 border-dashed p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  {subscription.packageCourt.name}
                </span>
                <small>Type: {subscription.packageCourt.type}</small>
              </div>
              <small>
                {format(new Date(subscription.startDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(subscription.endDate), "dd/MM/yyyy")}
              </small>
            </div>
            <div className="flex flex-col py-2">
              <div className="flex items-center justify-between py-2">
                <span>Total Price</span>
                <div className="flex items-start gap-1">
                  <span className="font-semibold">
                    {(subscription.totalPrice / 100).toFixed(2)}đ
                  </span>
                  {subscription?.packageCourt?.type.toLowerCase() ===
                    "custom" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            size={18}
                            className="cursor-pointer opacity-80"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex flex-col">
                            <div className="flex justify-between gap-5">
                              <span>VND</span>
                              <span>{subscription.priceEachCourt}</span>
                            </div>
                            <div className="flex justify-between gap-5">
                              <span>Courts</span>
                              <span>{subscription.totalCourt}</span>
                            </div>
                            <div className="flex justify-between gap-5">
                              <span>Days</span>
                              <span>{subscription.duration}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between gap-5">
                              <span className="font-semibold">Total</span>
                              <span className="font-semibold">
                                {subscription.totalPrice}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingSubscription;
