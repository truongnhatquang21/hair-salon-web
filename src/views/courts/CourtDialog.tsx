import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { SelectFieldTypeWrapWithEnum } from "@/components/SelectFieldTypeComp";
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
import { CourtStatusEnum } from "@/types";

import {
  courtSchema,
  type CourtType,
} from "../branches/create/slide/CourtRegistration";
import { FileUploadFileTypeWithAccept } from "../branches/ImagesUpload";
import { type CourtSchemaType } from "./helper";

type Props = {
  disabled?: boolean;
  Trigger: React.ReactNode;
  defaultValue: CourtType;
  onSubmit?: (data: CourtType) => boolean;
  title: string;
  description: string;
  readOnly?: boolean;
};

const CourtDialog = ({
  disabled = false,
  readOnly = false,
  Trigger,
  onSubmit,
  defaultValue,
  title,
  description,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const form = useForm<CourtSchemaType>({
    defaultValues: defaultValue || {},
    resolver: zodResolver(courtSchema),
    shouldFocusError: true,
    mode: "onChange",
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="flex h-3/5 w-[600px] flex-col overflow-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="relative w-full flex-1 gap-4 overflow-auto p-2">
          <AutoForm
            values={{
              ...defaultValue,
              status: defaultValue.status,
            }}
            controlForm={form}
            onSubmit={() => {
              const res = onSubmit
                ? onSubmit(form.getValues() as CourtType)
                : false;
              if (res) setIsDialogOpen(false);
            }}
            formSchema={courtSchema}
            fieldConfig={{
              images: {
                inputProps: {
                  disabled,
                  readOnly,
                  value: defaultValue.images,
                },
                fieldType: FileUploadFileTypeWithAccept({
                  accept: {
                    "image/*": [".jpeg", ".png", `.jpg`],
                  },
                }),
              },
              status: {
                inputProps: {
                  disabled: true,
                  readOnly: true,
                  placeholder: "Select Court Status",
                  value: defaultValue.status,
                  // defaultValue: defaultValue.status,
                },

                fieldType: SelectFieldTypeWrapWithEnum(
                  Object.values(CourtStatusEnum)
                ),
              },
              description: {
                inputProps: {
                  disabled,
                  readOnly,
                },
              },
              name: {
                inputProps: {
                  disabled,
                  readOnly,
                },
              },
              price: {
                inputProps: {
                  disabled,
                  readOnly,
                },
              },
            }}
          >
            <DialogFooter className="w-full">
              {onSubmit ? (
                <AutoFormSubmit className="w-full">
                  <Button className="w-full" type="submit">
                    Save Court
                  </Button>
                </AutoFormSubmit>
              ) : (
                <Button
                  className="w-full"
                  type="submit"
                  onClick={() => {
                    setIsDialogOpen(false);
                  }}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourtDialog;
