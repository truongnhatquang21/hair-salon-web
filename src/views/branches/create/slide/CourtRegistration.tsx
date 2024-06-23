import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgePlus,
  ChevronLeft,
  ChevronRight,
  Trash,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { IconRight } from "react-day-picker";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { Steppers } from "@/hooks/useStepper";
import defaultBadminton from "@/public/assets/images/defaultBadminton.jpeg";
import { useBranchStepStore } from "@/stores/createBranchStore";
import { CourtStatusEnum } from "@/types";

import { FieldType } from "../../ImagesUpload";

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
export const courtSchema = z.object({
  name: z.string({
    // Add a validation message for the field
    message: "Name is required",
  }),
  type: z.string({
    // Add a validation message for the field
    message: "Type is required",
  }),

  price: z.coerce.number().positive({ message: "Price is required" }),

  description: z.string({
    // Add a validation message for the field
    message: "Description is required",
  }),

  status: z
    .nativeEnum(CourtStatusEnum, {
      message: "Status is required",
    })
    .default(CourtStatusEnum.PENDING),
  images: z.any({
    message: "Images is required",
  }),
});
const formSchema = z.object({
  courts: z
    .array(courtSchema)
    .describe("Courts information")
    .nonempty("At least one court is required"),
});
type SchemaType = z.infer<typeof formSchema>;
type CourtType = z.infer<typeof courtSchema>;
const CourRegistration = ({
  stepIndex,
  goBackfn,
  goNextFn,
  steppers,
}: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {}) as SchemaType;
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    console.log(data.courts.length, "data");
    if (!data.courts || data.courts.length === 0) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please add court to continue",
      });
    } else {
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
    }
  };
  const courtCreate = (data: CourtType) => {
    const court = form.getValues("courts");

    if (court && court?.length > 0) {
      const checkCourt = court?.find((item) => item.name === data.name);
      if (checkCourt) {
        toast({
          title: "Error",
          description: "Court name is already exist",
          variant: "destructive",
        });
      } else {
        form.setValue("courts", [...court, data]);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Court has been added",
          className: "bg-green-600 text-white",
        });
        setIsDialogOpen(false);
      }
    } else {
      form.setValue("courts", [data]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Court has been added",
        className: "bg-green-600 text-white",
      });
    }
  };

  console.log(form.watch("courts"), "watch");
  return (
    <div className="flex size-full flex-col gap-4">
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
            Court Registration
          </h1>
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must fill out courts registration form to create a branch.
        <div className="flex  items-center justify-end gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto flex items-center gap-3">
                <BadgePlus /> Add Court
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-3/5 w-[600px] flex-col overflow-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add new court</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new court
                </DialogDescription>
              </DialogHeader>
              <div className="w-fullflex-1 relative gap-4 overflow-auto p-2">
                <AutoForm
                  onSubmit={courtCreate}
                  formSchema={courtSchema}
                  fieldConfig={{
                    images: {
                      fieldType: FieldType,
                    },
                  }}
                >
                  <DialogFooter className="w-full">
                    <AutoFormSubmit className="w-full">
                      <Button className="w-full" type="submit">
                        Save Court
                      </Button>
                    </AutoFormSubmit>
                  </DialogFooter>
                </AutoForm>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-2">
            <ZapIcon /> Fast generate courts
          </Button>
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-10 border-t py-2">
        {form?.watch("courts") && form?.watch("courts").length > 0 ? (
          form?.watch("courts").map((item: CourtType) => {
            return (
              <div
                key={item.name}
                className="relative z-10 col-span-2 flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-3 shadow-sm hover:bg-accent"
              >
                <Trash className="absolute bottom-1 right-1 z-30 rounded-full bg-red-200 p-2 text-red-700 opacity-40 shadow-md transition-all duration-300 ease-in hover:scale-125 hover:opacity-100" />

                <Image
                  alt="defaultBadminton"
                  src={defaultBadminton}
                  className="size-20 rounded-md object-cover shadow-md"
                />
                <div className="flex flex-1 flex-col gap-1 ">
                  <span className="text-lg font-semibold">{item.name}</span>
                  <span className="text-sm text-gray-700 underline underline-offset-2">
                    {item.price} VND
                  </span>
                  <span className="text-xs text-gray-500">{item.status}</span>
                  <span className="text-xs text-gray-500">{item.type}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-4 flex flex-col items-center justify-center gap-4">
            <span className="text-2xl font-semibold">No court added</span>{" "}
            <span className="text-sm text-gray-500">
              Please add court to continue
            </span>
          </div>
        )}
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

export default CourRegistration;
