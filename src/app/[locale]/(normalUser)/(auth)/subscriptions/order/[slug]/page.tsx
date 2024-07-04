"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { getSubscriptionByIdAPI } from "@/apiCallers/adminSubcription";
import { Loading } from "@/components/loading";
import {
  SubscriptionAutoForm,
  type subscriptionFormSchemaType,
  type subscriptionFormSchemaType,
} from "@/components/Subscription/SubcriptionForm";
import { PackageEnum } from "@/views/AdminSubscriptions/helper";

import { PricingCard } from "../../page";

const page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", slug],
    queryFn: async () => getSubscriptionByIdAPI(slug),
  });
  const router = useRouter();
  useEffect(() => {
    if (subscription) {
      if (subscription.data?.type === PackageEnum.Standard) {
        router.push(`/subscriptions/order/${slug}/checkout`);
      }
    }
  }, [subscription, router, slug]);

  const onSubmit = (value: subscriptionFormSchemaType) => {
    router.push(
      `/subscriptions/order/${slug}/checkout` +
        `?totalCourt=${value.totalCourt}&duration=${value.duration}`
    );
  };

  return (
    <div className="size-full ">
      {isLoading ? (
        <div className="flex w-full justify-center p-2">
          <Loading />
        </div>
      ) : subscription?.data ? (
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
          <div className="shadow-lg">
            <PricingCard {...subscription.data} showBtn={false} />
          </div>
          <div className="max-w-sm  justify-self-start p-2">
            <SubscriptionAutoForm
              onSubmit={onSubmit}
              defaultValue={{
                totalCourt: 1,
                duration: subscription.data?.duration || 0,
              }}
              priceEachCourt={subscription.data?.priceEachCourt as number}
            />
          </div>
        </div>
      ) : (
        <div>Subscription not found</div>
      )}
    </div>
  );
};

export default page;
