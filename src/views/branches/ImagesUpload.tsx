import type { Accept } from "react-dropzone";

import { ReactHookFormDemo } from "@/_components/react-hook-form-demo";
import type { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";
import FileUploaderV2 from "@/components/UploadImage/FIleUploaderV2";

export const FieldType = ({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) => (
  <ReactHookFormDemo
    field={field}
    isRequired={isRequired}
    label={label}
    defaultValue={field.value}
  />
);

export const FileUploadFileTypeWithAccept =
  ({ accept }: { accept: Accept }) =>
  (props: AutoFormInputComponentProps) => (
    <FileUploaderV2
      field={props.field}
      isRequired={props.isRequired}
      label={props.label}
      accetp={accept}
      defaultValue={props.field.value}
    />
  );
