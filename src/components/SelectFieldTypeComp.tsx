import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { AutoFormInputComponentProps } from './ui/auto-form/types';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const SelectFieldTypeComp = ({
  enumOptions,
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
  options,
}: AutoFormInputComponentProps & {
  enumOptions?: string[];
  options?: {
    label: string;
    value: string;
  }[];
}) => {
  // useEffect(() => {
  //   field.onChange(
  //     field.value ? field.value : fieldConfigItem.inputProps?.value
  //   );
  // }, [field.value]);

  return (
    // <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
    //   <FormControl>
    //     <Switch
    //       checked={field.value}
    //       onCheckedChange={field.onChange}
    //       {...fieldProps}
    //     />
    //   </FormControl>
    //   <div className="space-y-1 leading-none">
    //     <FormLabel>
    //       {label}
    //       {isRequired && <span className="text-destructive"> *</span>}
    //     </FormLabel>
    //     {fieldConfigItem.description && (
    //       <FormDescription>{fieldConfigItem.description}</FormDescription>
    //     )}
    //   </div>
    // </FormItem>

    <FormItem>
      <FormLabel>
        {fieldProps?.label || label}
        {isRequired && <span className='text-destructive'> *</span>}
      </FormLabel>
      <Select
        {...fieldProps}
        onValueChange={(value) => {
          field.onChange(value);
        }}
        value={field.value ? field.value : fieldConfigItem.inputProps?.value}
        defaultValue={
          field.value ? field.value : fieldConfigItem.inputProps?.value
        }
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={fieldProps.placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {enumOptions &&
            enumOptions.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          {options &&
            options.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <FormDescription>
        {fieldConfigItem.description && fieldConfigItem.description}
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

SelectFieldTypeComp.displayName = 'SelectFieldTypeComp';
export const SelectFieldTypeWrapWithEnum =
  (Enum: string[]) => (props: AutoFormInputComponentProps) => (
    <SelectFieldTypeComp {...props} enumOptions={Enum} />
  );
export const SelectFieldTypeWrapWithOptions =
  (
    options: {
      label: string;
      value: string;
    }[]
  ) =>
  (props: AutoFormInputComponentProps) => (
    <SelectFieldTypeComp {...props} options={options} />
  );
export default SelectFieldTypeComp;
