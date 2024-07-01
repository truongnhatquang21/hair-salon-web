"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { getSubscriptionListAPI } from "@/apiCallers/adminSubcription";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PackageEnum } from "@/views/AdminSubscriptions/helper";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  priceEachCourt: number;
  name: string;
  totalPrice: number;
  description: string;
  type: PackageEnum;
  _id?: string;
  duration: number;
  maxCourt: number;
  showBtn?: boolean;
};

const PricingHeader = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => (
  <section className="text-center">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="pt-1 text-xl">{subTitle}</p>
    <br />
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList className="px-2 py-6">
      <TabsTrigger value="0" className="text-base">
        {PackageEnum.Standard}
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        {PackageEnum.Custom}
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <span className="pt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
      {text}
    </span>
  </div>
);
function transformStringToArray(input: string): string[] {
  // Split the input string by newline character
  const lines = input.split("\n");

  // Trim each line and remove the leading '- ' if present
  const array = lines.map((line) =>
    line.trim().startsWith("- ") ? line.slice(2) : line
  );

  return array;
}

export const PricingCard = ({
  priceEachCourt,
  name,
  totalPrice,
  type,
  maxCourt,
  duration,
  description,

  _id,
  showBtn = true,
}: PricingCardProps) => {
  const router = useRouter();
  const des = transformStringToArray(description);

  return (
    <Card
      className={cn(`w-72 flex flex-col justify-between py-1 mx-auto sm:mx-0`, {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          true,
      })}
    >
      <div>
        <CardHeader className="pb-8 pt-4">
          <div className="flex size-full items-center justify-between">
            <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">
              {name}
            </CardTitle>
            {type === PackageEnum.Standard && (
              <div
                className={cn(
                  "min-w-[120px] h-[20px] px-2.5 rounded-xl  text-xs py-1 bg-gradient-to-r from-green-400 to-blue-400 text-black dark:bg-zinc-800 dark:text-white font-bold flex items-center gap-1",
                  {
                    "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black  ":
                      maxCourt >= 10,
                  }
                )}
              >
                <span className="text-xl text-white">{maxCourt}</span>Court
                {maxCourt > 1 ? "s" : ""}
              </div>
            )}
            {type === PackageEnum.Custom && (
              <div
                className={cn(
                  "min-w-[120px] h-[20px] px-2.5 rounded-xl  text-xs py-0.5 bg-gradient-to-r from-green-400 to-blue-400 text-black dark:bg-zinc-800 dark:text-white font-bold flex items-center gap-1",
                  {
                    "bg-gradient-to-r from-yellow-400 to-purple-400 dark:text-black  ":
                      true,
                  }
                )}
              >
                {type}
              </div>
            )}
          </div>

          <div className="flex gap-0.5">
            <h3 className="text-3xl font-bold">
              {totalPrice && `$ ${totalPrice}`}
              {priceEachCourt && !totalPrice && (
                <span>
                  $ {priceEachCourt}
                  <span className="text-base font-normal">/court</span>
                </span>
              )}
            </h3>
            <span className="mb-1 flex flex-col justify-end text-sm">
              {type === PackageEnum.Standard
                ? `/ ${duration} month${duration > 1 ? "s" : ""}`
                : null}
            </span>
          </div>
          <CardDescription className="h-12 pt-1.5">{des[0]}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {des.slice(1).map((d: string) => d && <CheckItem key={d} text={d} />)}
        </CardContent>
      </div>
      {showBtn && (
        <CardFooter className="mt-2">
          <Button
            onClick={() => {
              if (type === PackageEnum.Standard) {
                router.push(`/subscriptions/order/${_id}/checkout`);
              } else {
                router.push(`/subscriptions/order/${_id}`);
              }
            }}
            className="relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black"
          >
            <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
            {type === PackageEnum.Standard ? "Select Plan" : "Custom your plan"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
export default function Page() {
  const [isCustom, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) => setIsYearly(value === "1");

  const { data: SubscriptionList, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return getSubscriptionListAPI();
    },
  });

  const subsData = useMemo(() => {
    const Subs = SubscriptionList?.data;
    if (Subs && !isCustom) {
      return Subs.filter((sub) => sub.type === PackageEnum.Standard);
    }
    if (Subs && isCustom) {
      return Subs.filter((sub) => sub.type === PackageEnum.Custom);
    }
    return Subs;
  }, [SubscriptionList, isCustom]);
  return (
    <div className="py-8">
      <PricingHeader
        title="Pricing Plans"
        subTitle="Choose the plan that's right for you"
      />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      {
        // If the data is still loading, show a loading spinner
        isLoading ? (
          <div className="flex justify-center py-2">
            <Loading />
          </div>
        ) : (
          <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            {subsData
              ? subsData.map((plan) => {
                  return (
                    <PricingCard
                      priceEachCourt={plan.priceEachCourt as number}
                      key={plan._id}
                      description={plan.description as string}
                      duration={plan.duration as number}
                      maxCourt={plan.maxCourt as number}
                      name={plan.name as string}
                      totalPrice={plan.totalPrice as number}
                      type={plan.type as PackageEnum}
                      _id={plan._id as string}
                    />
                  );
                })
              : null}
          </section>
        )
      }
    </div>
  );
}
