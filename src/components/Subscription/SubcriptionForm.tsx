"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import AutoForm from "@/components/ui/auto-form";

import { Button } from "../ui/button";

// Define your form schema using zod
export const subscriptionFormSchema = z.object({
  totalCourt: z
    .number()
    .min(1, {
      message: "Duration is required",
    })
    .default(1),
  duration: z
    .number()
    .min(1, {
      message: "Duration is required",
    })
    .default(1)
    .describe("Months per court"),
});
export type SubscriptionFormSchemaType = z.infer<typeof subscriptionFormSchema>;
type Props = {
  onSubmit: (value: SubscriptionFormSchemaType) => void;
  defaultValue?: SubscriptionFormSch;
  priceEachCourt: number;
};
export function SubscriptionAutoForm({
  onSubmit,
  defaultValue,
  priceEachCourt,
}: Props) {
  const router = useRouter();
  const form = useForm<SubscriptionFormSchemaType>({
    defaultValues: defaultValue || {},
    resolver: zodResolver(subscriptionFormSchema),
  });
  const totalPrice = useMemo(() => {
    if (
      !form.watch("totalCourt") ||
      !form.watch("duration") ||
      !priceEachCourt ||
      form.watch("totalCourt") <= 0
    ) {
      return 0;
    }
    return form.watch("totalCourt") * priceEachCourt;
  }, [form.watch("totalCourt")]);
  return (
    <AutoForm
      controlForm={form}
      onSubmit={onSubmit}
      values={defaultValue}
      // Pass the schema to the form
      formSchema={subscriptionFormSchema}
      // You can add additional config for each field
      // to customize the UI
      fieldConfig={{
        totalCourt: {
          inputProps: {
            placeholder: "Total court",
          },
        },
        duration: {
          description: "This is the common duration for all courts.",
          inputProps: {
            readOnly: true,
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
      <h3 className="text-3xl font-bold">${totalPrice}</h3>
      <Button className="w-full">Continue</Button>

      {/*
      All children passed to the form will be rendered below the form.
      */}
    </AutoForm>
  );
}
