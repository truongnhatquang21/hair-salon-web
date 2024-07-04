import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { IconRight } from "react-day-picker";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Steppers } from "@/hooks/useStepper";
import { regexPhoneNumber } from "@/lib/regex";
import { useBranchStepStore } from "@/stores/createBranchStore";

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};

export const detailsFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Username must be greater than 1 characters!" }),
  address: z.string(),

  description: z.string().optional().nullable(),

  phone: z
    .string()
    .min(1, { message: "Phone must be greater than 1 number!" })
    .max(10, { message: "Phone must be less than 10 number!" })
    .regex(regexPhoneNumber, { message: "Phone must be a valid phone" }),

  // availableTime: z.string({
  //   // Add a validation message for the field
  //   message: "Available time is required",
  // }),
});
export type DetailsSchemaType = z.infer<typeof detailsFormSchema>;
const BranchDetails = ({ goBackfn, steppers, stepIndex, goNextFn }: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {}) as DetailsSchemaType;
  const form = useForm<DetailsSchemaType>({
    resolver: zodResolver(detailsFormSchema),
    values: initialValues,
    shouldFocusError: true,
  });

  const validateForm = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please check your form again",
      });
    }
  };
  const onSubmit: SubmitHandler<DetailsSchemaType> = async (data) => {
    setBranchStep({
      step: stepIndex,
      data,
    });
    toast({
      title: "Success",
      description:
        "Your data has been saved in draft, if you want to continue please click next button",
      className: "bg-green-600 text-white",
    });
    goNextFn(stepIndex + 1);

    console.log(branchStep, "branchStep");
  };

  return (
    <div className="flex size-full flex-col gap-2">
      <div className="flex w-full items-center gap-4">
        <Button
          className="mr-auto flex select-none items-center justify-center gap-2 px-4"
          disabled={stepIndex === 0}
          onClick={() => {
            goBackfn();
          }}
        >
          <ChevronLeft />
          Back
        </Button>

        <span className="flex flex-1 items-center justify-center text-center text-xl font-semibold">
          Step-{stepIndex}
          <IconRight />{" "}
          <h1 className="text-center text-2xl font-bold uppercase">
            General Information
          </h1>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must provide us with the general information about your branch
        {/* <Button variant="outline" className="flex items-center gap-2">
          <ShoppingBagIcon /> Extend your subscriptions
        </Button> */}
      </div>
      <div className="flex  items-center border-t p-2">
        <AutoForm
          onSubmit={onSubmit}
          values={form.getValues()}
          controlForm={form}
          formSchema={detailsFormSchema}
          fieldConfig={{
            name: {
              inputProps: {
                placeholder: "Branch name",
              },
              description: "Name of your branch",
            },
            phone: {
              inputProps: {
                placeholder: "Phone number",
              },
              description: "Phone number of your branch",
            },
            address: {
              inputProps: {
                placeholder: "Address",
              },
              description: "Address of your branch",
            },
            description: {
              inputProps: {
                placeholder: "Description",
              },
              fieldType: "textarea",
              description: "Description of your branch",
            },
            // availableTime: {
            //   inputProps: {
            //     placeholder: "Available time",
            //   },
            //   description: "Available time of your branch",
            // },
          }}
        >
          <AutoFormSubmit className="w-full">
            <Button
              type="submit"
              className="flex w-full select-none items-center justify-center gap-2 px-4"
              disabled={stepIndex === steppers.length}
              onClick={() => {
                validateForm();
              }}
            >
              Next <ChevronRight />
            </Button>
          </AutoFormSubmit>
        </AutoForm>
      </div>
    </div>
  );
};

export default BranchDetails;
