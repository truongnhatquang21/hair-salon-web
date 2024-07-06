import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { IconRight } from "react-day-picker";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { ReactHookFormDemo } from "@/_components/react-hook-form-demo";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import type { Steppers } from "@/hooks/useStepper";
import { useBranchStepStore } from "@/stores/createBranchStore";

const schema = z.object({
  images: z.any(),
});

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
type Schema = z.infer<typeof schema>;
const ImagesUploader = ({ goBackfn, goNextFn, steppers, stepIndex }: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {}) as Schema;
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    console.log(data, "images data");

    if (!data.images || data.images.length === 0) {
      return toast({
        title: "Error",
        variant: "destructive",
        description: "Please check your form again",
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
            Images Uploader
          </h1>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must upload at least 1 image and can upload up to 4 images in your
        current subcriptions.
        {/* <Button variant="outline" className="flex items-center gap-2">
          <ShoppingBagIcon /> Extend your subscriptions
        </Button> */}
      </div>
      <div className="relative flex items-center border-t p-2">
        {/* <AutoForm
          formSchema={schema}
          controlForm={form}
          fieldConfig={{
            images: {
              inputProps: {
                value: initialValues.images,
              },
              fieldType: FileUploadFileTypeWithAccept({
                accept: {
                  "image/*": [".jpeg", ".png", `.jpg`],
                },
              }),
            },
          }}
        /> */}
        <FormField
          name="images"
          control={form.control}
          render={({ field }) => {
            return (
              <ReactHookFormDemo label="Images" isRequired field={field} />
            );
          }}
        />
      </div>
      <Button
        type="submit"
        className="flex w-full select-none items-center justify-center gap-2 px-4"
        disabled={stepIndex === steppers.length}
        onClick={() => {
          onSubmit(form.getValues());
        }}
      >
        Next <ChevronRight />
      </Button>
    </div>
  );
};

export default ImagesUploader;
