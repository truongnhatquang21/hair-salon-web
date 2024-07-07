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

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useBranchStepStore } from "@/stores/createBranchStore";
import { CourtStatusEnum } from "@/types";
import CourtDialog from "@/views/courts/CourtDialog";

import { FileUploadFileTypeWithAccept } from "../../ImagesUpload";

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
export type CourtType = z.infer<typeof courtSchema>;
const CourRegistration = ({
  stepIndex,
  goBackfn,
  goNextFn,
  steppers,
}: Props) => {
  const [isGenerateCourtDialogOpen, setIsGenerateCourtDialogOpen] =
    useState(false);
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

  const steps = useBranchStepStore((state) => state.stepStore);
  console.log(steps, "steps");

  const deleteCourt = (name: string) => {
    const court = form.getValues("courts");
    const newCourt = court?.filter((item: CourtType) => item.name !== name);
    form.setValue("courts", newCourt);
  };

  const generateCourt = () => {
    const sampleCourt = form.getValues("courts")[0];
    const totalCourt =
      (steps[1]?.data as { amount: number }).amount -
      form.getValues("courts").length;

    const generatedCourts = [];
    for (let i = 0; i < totalCourt; i += 1) {
      generatedCourts.push({
        ...sampleCourt,
        name: `${sampleCourt.name}-${i + 1}`,
      });
    }

    if (generatedCourts.length > 0) {
      form.setValue("courts", [
        ...form.getValues("courts"),
        ...generatedCourts,
      ]);
      toast({
        title: "Success",
        description: "Courts has been generated",
        className: "bg-green-600 text-white",
      });
    } else {
      toast({
        title: "Infor",
        description: "you has no court to generate",
      });
    }
    setIsGenerateCourtDialogOpen(false);
  };
  const editCourt = (name: string, payload: CourtType) => {
    const court = form.getValues("courts");
    if (court && court?.length > 0) {
      const checkCourt = court?.find(
        (item) => name !== item.name && item.name === payload.name
      );
      if (checkCourt) {
        toast({
          title: "Error",
          description: "Court name is already exist",
          variant: "destructive",
        });
        return false;
      }
    }
    const newCourt = court?.map((item: CourtType) => {
      if (item.name === name) {
        return payload;
      }
      return item;
    });
    form.setValue("courts", newCourt);
    toast({
      title: "Success",
      description: "Court has been updated",
      className: "bg-green-600 text-white",
    });

    return true;
  };

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
              <Button
                className="ml-auto flex items-center gap-3"
                disabled={
                  form?.watch("courts") &&
                  form?.watch("courts").length >= steps[1]?.data.amount
                }
              >
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
              <div className="relative w-full flex-1 gap-4 overflow-auto p-2">
                <AutoForm
                  onSubmit={courtCreate}
                  formSchema={courtSchema}
                  fieldConfig={{
                    images: {
                      fieldType: FileUploadFileTypeWithAccept({
                        accept: {
                          "image/*": [".jpeg", ".png", `.jpg`],
                        },
                      }),
                    },
                    status: {
                      inputProps: {
                        readOnly: true,
                        disabled: true,
                        defaultValue: CourtStatusEnum.PENDING,
                      },
                    },
                    description: {
                      fieldType: "textarea",
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
          <AlertDialog
            open={isGenerateCourtDialogOpen}
            onOpenChange={setIsGenerateCourtDialogOpen}
          >
            <AlertDialogTrigger>
              <Button variant="outline" className="flex items-center gap-2 ">
                <ZapIcon /> Fast generate courts
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {form.watch("courts")?.length
                    ? "You can generate the courts based on your previous setup. This will override your current courts. Are you sure you want to continue?"
                    : "This feature needs at least one court to generate the courts. Please add at least one court to continue."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {form.watch("courts")?.length && (
                  <Button
                    onClick={() => {
                      generateCourt();
                    }}
                    className="flex items-center gap-2"
                  >
                    <ZapIcon /> Generate court
                  </Button>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-10 border-t py-2">
        {form?.watch("courts") && form?.watch("courts").length > 0 ? (
          form?.watch("courts").map((item: CourtType) => {
            return (
              <CourtDialog
                isCreatingBranch
                onSubmit={(data) => {
                  const res = editCourt(item.name, data);
                  return res;
                }}
                Trigger={
                  <div className="relative z-10 col-span-2 flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed p-3 shadow-sm hover:bg-accent">
                    <Trash
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourt(item.name);
                      }}
                      className="absolute bottom-1 right-1 z-30 rounded-full bg-red-200 p-2 text-red-700 opacity-40 shadow-md transition-all duration-300 ease-in hover:scale-125 hover:opacity-100"
                    />

                    <Image
                      width={20}
                      height={20}
                      alt="defaultBadminton"
                      src={
                        typeof item.images[0] === "string"
                          ? item.images[0]
                          : URL.createObjectURL(item.images[0])
                      }
                      className="size-20 rounded-md object-cover shadow-md"
                    />
                    <div className="flex flex-1 flex-col gap-1 ">
                      <span className="text-lg font-semibold">{item.name}</span>
                      <span className="text-sm text-gray-700 underline underline-offset-2">
                        {item.price} VND
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-500">{item.type}</span>
                    </div>
                  </div>
                }
                defaultValue={item}
                description="Fill out the form below to update court"
                title="Update court"
                key={item.name}
              />
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
