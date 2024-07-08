import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { updateSlotAPI } from "@/apiCallers/slot";
import { SelectFieldTypeWrapWithEnum } from "@/components/SelectFieldTypeComp";
import SpinnerIcon from "@/components/SpinnerIcon";
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
import { WeekDayEnum } from "@/types";

import { SlotSchema, type SlotSchemaType } from "./create/slide/AvailableSlot";
import { TimeFieldType } from "./create/slide/PeriodTimeField";

type Props = {
  Trigger: React.ReactNode;
  defaultValue: SlotSchemaType & { _id: string };
  onSubmit?: (data: SlotSchemaType) => boolean;
  title: string;
  description: string;
  invalidateKey?: string[];
  isViewOnly?: boolean;
  isCreateBranch?: boolean;
};

const SlotDialog = ({
  isCreateBranch = false,
  isViewOnly,
  Trigger,
  onSubmit,
  defaultValue,
  title,
  description,
  invalidateKey,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const { mutateAsync: updateTrigger, isPending: isUpdating } = useMutation({
    mutationFn: async (data: SlotSchemaType & { _id: string }) => {
      return updateSlotAPI(data);
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
  const onSubmitHandle = async (data: SlotSchemaType) => {
    try {
      if (!isCreateBranch)
        await updateTrigger({ ...data, _id: defaultValue._id });
      onSubmit && onSubmit({ ...data, _id: defaultValue._id });
      if (invalidateKey) {
        QueryClient.invalidateQueries({
          queryKey: invalidateKey,
        });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-h-[80%] overflow-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AutoForm
            values={defaultValue}
            onSubmit={async (data) => {
              const res = await onSubmitHandle(data);
              if (res) setIsDialogOpen(false);
            }}
            formSchema={SlotSchema}
            fieldConfig={{
              startTime: {
                fieldType: TimeFieldType,
                label: "Start time",
                inputProps: {
                  value: defaultValue.startTime,
                },
                // fieldType: TimePickerDemo,
                description: "Start time must be a valid time",
              },
              endTime: {
                fieldType: TimeFieldType,
                label: "End time",
                inputProps: { value: defaultValue.endTime },
                // fieldType: TimePickerDemo,
                description: "End time must be a valid time",
              },

              weekDay: {
                inputProps: {
                  defaultValue: defaultValue.weekDay,
                  placeholder: "Week Day",
                  value: defaultValue.weekDay,
                },
                fieldType: SelectFieldTypeWrapWithEnum(
                  Object.values(WeekDayEnum)
                ),
              },
              surcharge: {
                inputProps: {
                  placeholder: "Surcharge",
                  defaultValue: 0,
                },
                description: "Surcharge must be a positive number",
              },
            }}
          >
            <AutoFormSubmit className="w-full">
              <DialogFooter className="w-full">
                {!isViewOnly && onSubmit ? (
                  <Button
                    className="flex w-full items-center justify-center"
                    type="submit"
                  >
                    {
                      // eslint-disable-next-line no-nested-ternary
                      isUpdating ? <SpinnerIcon /> : "Update"
                    }
                  </Button>
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
            </AutoFormSubmit>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDialog;
