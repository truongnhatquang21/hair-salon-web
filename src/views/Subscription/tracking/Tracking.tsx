/* eslint-disable no-underscore-dangle */

"use client";

import { format } from "date-fns";
import { Info } from "lucide-react";
import React from "react";

import { EmptyComponent } from "@/components/Empty";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ITrackingSubscription } from "@/types/TrackingSubscription";

type TrackingProps = {
  subscriptions: ITrackingSubscription[];
  isLoading?: boolean;
};

const Tracking: React.FC<TrackingProps> = ({ subscriptions, isLoading }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-3">
      {subscriptions?.length > 0 ? (
        subscriptions?.map((subscription) => (
          <div
            key={subscription._id}
            className="flex w-5/12 flex-col gap-2 rounded-md border-2 border-dashed p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  {subscription?.packageCourt?.name}
                </span>
                <small>Type: {subscription?.packageCourt?.type}</small>
              </div>
              <small>
                {format(new Date(subscription?.startDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(subscription?.endDate), "dd/MM/yyyy")}
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
                              <span>
                                {subscription?.packageCourt?.priceEachCourt}
                              </span>
                            </div>
                            <div className="flex justify-between gap-5">
                              <span>Courts</span>
                              <span>{subscription.totalCourt}</span>
                            </div>
                            <div className="flex justify-between gap-5">
                              <span>Days</span>
                              <span>{subscription?.duration}</span>
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
        ))
      ) : (
        <EmptyComponent
          title="No Subscriptions Found"
          description="You haven't made any subscriptions yet. Start subscript now to manage your subscriptions."
          className="w-full"
        />
      )}
    </div>
  );
};

export default Tracking;
