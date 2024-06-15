import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, ZapIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AutoForm from "@/components/ui/auto-form";
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
import { CourtStatusEnum } from "@/types";

import { FieldType } from "../../ImagesUpload";

type Props = {};
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
const CourRegistration = (props: Props) => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courts: [],
    },
  });
  return (
    <div className="flex size-full flex-col gap-4">
      <h1 className="text-center text-2xl font-bold uppercase">
        Court Registration
      </h1>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-3xl text-destructive">*</span>
        You must fill out courts registration form to create a branch.
        <div className="flex  items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-auto flex items-center gap-3">
                <BadgePlus /> Add Court
              </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[50%] flex-col overflow-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add new court</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new court
                </DialogDescription>
              </DialogHeader>
              <div className="relative flex-1 gap-4 overflow-auto p-2">
                <AutoForm
                  formSchema={courtSchema}
                  fieldConfig={{
                    images: {
                      fieldType: FieldType,
                    },
                  }}
                />
              </div>
              <DialogFooter className="w-full">
                <Button className="w-full" type="submit">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-2">
            <ZapIcon /> Fast generate courts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourRegistration;
