import React from "react";

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
import { WeekDayEnum } from "@/types";

import { SlotSchema, type SlotSchemaType } from "./create/slide/AvailableSlot";
import { TimeFieldType } from "./create/slide/PeriodTimeField";

type Props = {
  Trigger: React.ReactNode;
  defaultValue: SlotSchemaType;
  onSubmit?: (data: SlotSchemaType) => boolean;
  title: string;
  description: string;
};

const SlotDialog = ({
  Trigger,
  onSubmit,
  defaultValue,
  title,
  description,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
            onSubmit={(data) => {
              const res = onSubmit ? onSubmit(data) : false;
              if (res) setIsDialogOpen(false);
            }}
            formSchema={SlotSchema}
            fieldConfig={{
              startTime: {
                fieldType: TimeFieldType,
                inputProps: {
                  value: defaultValue.startTime,
                },
                // fieldType: TimePickerDemo,
                description: "Start time must be a valid time",
              },
              endTime: {
                fieldType: TimeFieldType,
                inputProps: { value: defaultValue.endTime },
                // fieldType: TimePickerDemo,
                description: "End time must be a valid time",
              },

              weekDay: {
                inputProps: {
                  value: defaultValue.weekDay,
                  placeholder: "Week Day",
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
                {onSubmit ? (
                  <Button className="w-full" type="submit">
                    Save slot
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
