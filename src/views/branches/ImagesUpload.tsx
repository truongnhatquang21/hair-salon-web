import type { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const FieldType = ({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) => (
  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
    <FormControl>
      <Input
        checked={field.value}
        onCheckedChange={field.onChange}
        {...fieldProps}
      />
    </FormControl>
    <div className="space-y-1 leading-none">
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
    </div>
  </FormItem>
);
