/* eslint-disable no-underscore-dangle */

"use client";

import { format } from "date-fns";
import { Info } from "lucide-react";
import React from "react";

import CustomTag from "@/components/CustomTag";
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
  console.log(subscriptions);
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
                <small className="mt-2">
                  Type: {subscription?.packageCourt?.type}
                </small>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-end">
                  <CustomTag status={subscription?.status} />
                </div>
                <small className="mt-2">
                  Purchase date:{" "}
                  {format(new Date(subscription?.createdAt), "dd/MM/yyyy")}
                </small>
              </div>
            </div>
            <Separator className="mt-2" />
            <div className="flex flex-col py-2">
              <div className="flex items-center justify-between py-2">
                <span>Active date</span>
                <span>
                  {format(new Date(subscription?.startDate), "dd/MM/yyyy")} -{" "}
                  {format(new Date(subscription?.endDate), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Duration</span>
                <span>
                  {subscription?.duration}{" "}
                  {subscription?.duration <= 1 ? "month" : "months"}
                </span>
              </div>
              {subscription?.priceEachCourt ? (
                <div className="flex items-center justify-between py-2">
                  <span>Court price</span>
                  <span>{subscription?.priceEachCourt}</span>
                </div>
              ) : (
                <div />
              )}
              <div className="flex items-center justify-between py-2">
                <span>Total court</span>
                <span>{subscription?.totalCourt}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="font-semibold">Total price</span>
                <div className="flex items-start gap-1">
                  <span className="font-semibold">
                    {subscription.totalPrice}đ
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
                              <span>Months</span>
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
