"use client";

import * as z from "zod";

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";

import { Button } from "../ui/button";

// Define your form schema using zod
const formSchema = z.object({
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

export function SubscriptionAutoForm() {
  return (
    <AutoForm
      onSubmit={(value) => {
        console.log(value);
      }}
      // Pass the schema to the form
      formSchema={formSchema}
      // You can add additional config for each field
      // to customize the UI
      fieldConfig={{
        totalCourt: {
          inputProps: {
            placeholder: "Total court",
          },
        },
        duration: {
          description: "This duration will applied for all courts",
          inputProps: {
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
      <AutoFormSubmit>Send now</AutoFormSubmit>

      {/*
      All children passed to the form will be rendered below the form.
      */}
      <p className="flex items-center gap-1 text-sm text-gray-500">
        By submitting this form, you agree to our
        <Button variant="link" className="-px-[2px] text-primary underline">
          terms and conditions
        </Button>
        .
      </p>
    </AutoForm>
  );
}
