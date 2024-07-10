import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import { updateCourtAPI } from "@/apiCallers/courts";
import { SelectFieldTypeWrapWithEnum } from "@/components/SelectFieldTypeComp";
import SpinnerIcon from "@/components/SpinnerIcon";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
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
import { CourtStatusEnum } from "@/types";

import {
  courtSchema,
  type CourtType,
} from "../branches/create/slide/CourtRegistration";
import { FileUploadFileTypeWithAccept } from "../branches/ImagesUpload";
import { type CourtSchemaType, type CourtSchemaTypeWithId } from "./helper";

type Props = {
  disabled?: boolean;
  Trigger: React.ReactNode;
  defaultValue: CourtType;
  onSubmit?: (data: CourtType) => boolean;
  title: string;
  description: string;
  readOnly?: boolean;
  invalidateKey?: string[];
  isCreatingBranch?: boolean;
};

const CourtDialog = ({
  invalidateKey,
  disabled = false,
  readOnly = false,
  Trigger,
  onSubmit,
  defaultValue,
  title,
  description,
  isCreatingBranch = false,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const form = useForm<CourtSchemaType>({
    defaultValues: defaultValue || {},
    resolver: zodResolver(courtSchema),
    shouldFocusError: true,
    mode: "onChange",
  });

  const { toast } = useToast();

  const { mutateAsync: updateTrigger, isPending: isUpdating } = useMutation({
    mutationFn: async (data: CourtSchemaTypeWithId) => {
      return updateCourtAPI(data);
    },
    onSuccess: (data) => {
      if (!data.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });

        throw new Error(data.message || data.statusText);
      }

      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }

      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    },
  });
  const QueryClient = useQueryClient();

  const onSubmitHandle = async (data: CourtSchemaType) => {
    try {
      if (!isCreatingBranch) {
        await updateTrigger({ ...data, _id: defaultValue._id });
      }
      onSubmit && onSubmit({ ...data, _id: defaultValue._id });
      if (invalidateKey) {
        QueryClient.invalidateQueries({
          queryKey: invalidateKey,
        });
      }
      return true;
    } catch (e) {
      console.error(e);
    }
  };
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
            onSubmit={async (data) => {
              const res = await onSubmitHandle(data);
              if (res) setIsDialogOpen(false);
            }}
            dependencies={[
              {
                sourceField: "type",
                targetField: "status",
                type: DependencyType.DISABLES,
                when: () => defaultValue?.status === CourtStatusEnum.PENDING,
              },
            ]}
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
                    "image/png": [".jpeg", ".png", `.jpg`],
                  },
                  readOnly,
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
                  Object.values(CourtStatusEnum)?.filter((item) =>
                    defaultValue?.status === CourtStatusEnum.PENDING
                      ? item === CourtStatusEnum.PENDING
                      : item !== CourtStatusEnum.PENDING
                  )
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
              {!readOnly && onSubmit ? (
                <AutoFormSubmit className="w-full">
                  <Button
                    className="flex w-full items-center justify-center"
                    type="submit"
                  >
                    {isUpdating ? <SpinnerIcon /> : "Update"}
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
