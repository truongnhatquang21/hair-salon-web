import { useEffect, useState } from "react";

import { TimePickerDemo } from "@/components/time-picker/TimePicker";
import type { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";

export const PeriodTimeFieldType = ({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    fieldConfigItem.inputProps?.value
      ? new Date(
          `${new Date().toISOString().slice(0, 10)}T${fieldConfigItem.inputProps?.value.toString().split("-")[0]}:00`
        )
      : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    fieldConfigItem.inputProps?.value
      ? new Date(
          `${new Date().toISOString().slice(0, 10)}T${fieldConfigItem.inputProps?.value.toString().split("-")[1]}:00`
        )
      : new Date()
  );
  useEffect(() => {
    if (startDate && endDate) {
      field.onChange(
        `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}-${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`
      );
    }
  }, [startDate, endDate]);

  return (
    <div className="flex w-full flex-col gap-2 ">
      <span className="flex items-center gap-1 text-sm font-medium">
        {label}{" "}
        {isRequired && <span className="text-sm text-destructive">*</span>}
      </span>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border-2 border-dashed p-2">
          <span className="flex items-center gap-1 text-sm font-medium">
            Start time <span className="text-sm text-destructive">*</span>
          </span>
          <TimePickerDemo
            disabled={fieldConfigItem.inputProps?.disabled}
            date={startDate}
            setDate={setStartDate}
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border-2 border-dashed p-2">
          <span className="flex items-center gap-1 text-sm font-medium">
            End time <span className="text-sm text-destructive">*</span>
          </span>
          <TimePickerDemo
            disabled={fieldConfigItem.inputProps?.disabled}
            date={endDate}
            setDate={setEndDate}
          />
        </div>
      </div>

      <span className="text-sm text-gray-500">
        {fieldConfigItem.description}
      </span>
    </div>
  );
};

export const TimeFieldType = ({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    fieldConfigItem.inputProps?.value
      ? new Date(
          `${new Date().toISOString().slice(0, 10)}T${fieldConfigItem.inputProps?.value}:00`
        )
      : new Date()
  );
  useEffect(() => {
    if (startDate) {
      field.onChange(
        `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`
      );
    }
  }, [startDate]);

  return (
    <div className="flex w-full flex-col gap-2 ">
      <span className="flex items-center gap-1 text-sm font-medium">
        {label}{" "}
        {isRequired && <span className="text-sm text-destructive">*</span>}
      </span>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border-2 border-dashed p-2">
          <span className="flex items-center gap-1 text-sm font-medium">
            Start time <span className="text-sm text-destructive">*</span>
          </span>
          <TimePickerDemo
            disabled={fieldConfigItem.inputProps?.disabled}
            date={startDate}
            setDate={setStartDate}
          />
        </div>
      </div>

      <span className="text-sm text-gray-500">
        {fieldConfigItem.description}
      </span>
    </div>
  );
};
