"use client";

import { Plus } from "lucide-react";
import React from "react";

import { plan } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/order/[slug]/page";
import { PricingCard } from "@/app/[locale]/(normalUser)/(auth)/subscriptions/page";
import { subscriptionFormSchema } from "@/components/Subscription/SubcriptionForm";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";

type Props = {};

const CheckoutSubcription = (props: Props) => {
  return (
    <div className=" mx-auto my-10 flex w-[600px] flex-col items-center gap-5">
      <div className="text-xl font-semibold">Checkout confirmation</div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You are about to checkout with the following subscription, please review
        and confirm all details before proceeding.
      </div>
      <div className="flex w-full flex-col gap-4 ">
        <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
          <span className="border-b font-semibold ">Subscription details</span>
          <div className="flex w-full flex-col items-center gap-4">
            <div className="col-span-1  p-5 ">
              <PricingCard key={plan.title} {...plan} isYearly={false} />
            </div>
            <div className="w-full border-t-2 p-2">
              <AutoForm
                onSubmit={(value) => {
                  console.log(value);
                }}
                // Pass the schema to the form
                formSchema={subscriptionFormSchema}
                // You can add additional config for each field
                // to customize the UI
                fieldConfig={{
                  totalCourt: {
                    inputProps: {
                      disabled: true,
                      placeholder: "Total court",
                    },
                  },
                  duration: {
                    inputProps: {
                      disabled: true,
                      placeholder: "Duration",
                    },
                  },
                }}
                // Optionally, define dependencies between fields
              >
                {/* 
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
              </AutoForm>
            </div>
          </div>
          <span className="text-center text-2xl underline underline-offset-2">
            <strong>Total price:</strong> $10
          </span>
        </div>
        <div className="flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-2">
          <span className="flex items-center  justify-between border-b font-semibold">
            Payment method
            <Button
              className="my-1  flex items-center gap-1"
              variant="secondary"
            >
              <Plus />
              Add new card
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSubcription;
