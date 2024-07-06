import type { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";

export const PaymentFieldType = ({
  enumOptions,
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) => {
  // useEffect(() => {
  //   field.onChange(
  //     field.value ? field.value : fieldConfigItem.inputProps?.value
  //   );
  // }, [field.value]);
  console.log(field.value, fieldConfigItem.inputProps?.defaultValue);

  return <div>dsaf</div>;
};
