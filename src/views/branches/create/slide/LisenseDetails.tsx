import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { IconRight } from "react-day-picker";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import FileUploaderV2 from "@/components/UploadImage/FIleUploaderV2";
import type { Steppers } from "@/hooks/useStepper";
import { useBranchStepStore } from "@/stores/createBranchStore";

const schema = z.object({
  licenses: z.array(z.instanceof(File)),
});

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
type Schema = z.infer<typeof schema>;
const LisenseDetails = ({ goBackfn, goNextFn, steppers, stepIndex }: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {}) as Schema;
  console.log(initialValues, "initialValues");

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });
  const validateForm = async () => {};
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    console.log(data, "licenses data");

    if (!data.licenses || data.licenses.length === 0) {
      console.log(data.licenses);

      toast({
        title: "Error",
        variant: "destructive",
        description: "Please check your form again",
      });
      return form.setError("licenses", {
        message: "Please upload image",
      });
    }
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
    <div className="flex size-full flex-col gap-2 overflow-auto">
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
            Licenses Uploader
          </h1>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must upload at least 1 document for your lisense details.
        {/* <Button variant="outline" className="flex items-center gap-2">
          <ShoppingBagIcon /> Extend your subscriptions
        </Button> */}
      </div>
      <div className="relative flex items-center border-t p-2">
        <FormField
          defaultValue={form.getValues("licenses")}
          name="licenses"
          control={form.control}
          render={({ field }) => {
            return (
              <FileUploaderV2
                label="Images"
                isRequired
                field={field}
                accetp={{
                  "image/png": [".jpeg", ".png", `.jpg`],
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc"],
                }}
              />
            );
          }}
        />
      </div>
      <Button
        type="submit"
        className="flex w-full select-none items-center justify-center gap-2 px-4"
        disabled={stepIndex === steppers.length}
        onClick={() => {
          validateForm();
          onSubmit(form.getValues());
        }}
      >
        Next <ChevronRight />
      </Button>
    </div>
  );
};

export default LisenseDetails;
