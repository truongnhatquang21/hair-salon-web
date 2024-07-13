"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateProfileAPI } from "@/apiCallers/Customer";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { GenderEnum, RoleEnum, UserStatusEnum } from "@/types";
import {
  createCustomerSchema,
  type CreateCustomerSchemaTypeWithId,
  type CreateCustomerSchemaTypeWithId,
} from "@/views/customer/helper";

import { SelectFieldTypeWrapWithEnum } from "../SelectFieldTypeComp";
import SpinnerIcon from "../SpinnerIcon";
import { DependencyType } from "../ui/auto-form/types";
import { useToast } from "../ui/use-toast";

// Define your form schema using zod
const formSchema = z.object({
  username: z.string({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(),
  role: z.nativeEnum(RoleEnum, { message: "Role is required" }),
  gender: z.nativeEnum(GenderEnum).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(UserStatusEnum, {
    message: "Status is required",
  }),
  dob: z.coerce.date().optional(),
});

export function AccountAutoForm({
  defaultValue,
}: {
  defaultValue: CreateCustomerSchemaTypeWithId;
}) {
  const form = useForm<CreateCustomerSchemaTypeWithId>({
    defaultValues: defaultValue,
    resolver: zodResolver(createCustomerSchema),
  });
  const { setError } = form;
  const { toast } = useToast();
  const { mutateAsync: updateTrigger, isPending: isUpdatePending } =
    useMutation({
      mutationFn: async (data: CreateCustomerSchemaTypeWithId) => {
        return updateProfileAPI(data);
      },
      onSuccess: (data) => {
        if (!data.ok) {
          if (data.error) {
            const errs = data.error as { [key: string]: { message: string } };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof CreateCustomerSchemaTypeWithId, {
                type: "manual",
                message: value.message,
              });
            });
          }

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
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message || error.statusText,
        });
      },
    });

  useEffect(() => {
    form.reset(defaultValue);
  }, [defaultValue]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const onSubmit = async (value: CreateCustomerSchemaTypeWithId) => {
    try {
      const preparedData = {
        ...value,
        dob: format(value.dob, "yyyy-MM-dd"),
        _id: defaultValue._id,
      };
      console.log(preparedData, "ppd");

      await updateTrigger(preparedData);
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className=" w-full rounded-sm border p-4 shadow-md">
      <AutoForm
        controlForm={form}
        onSubmit={onSubmit}
        values={defaultValue}
        // Pass the schema to the form
        formSchema={formSchema}
        dependencies={[
          {
            sourceField: "role",
            targetField: "password",
            type: DependencyType.HIDES,
            when: () => true,
          },
          {
            sourceField: "role",
            targetField: "email",
            type: DependencyType.DISABLES,
            when: () => true,
          },
        ]}
        // You can add additional config for each field
        // to customize the UI
        fieldConfig={{
          role: {
            inputProps: {
              readOnly: true,
              disabled: true,
            },
          },
          status: {
            inputProps: {
              readOnly: true,
              disabled: true,
            },
          },

          password: {
            // Use "inputProps" to pass props to the input component
            // You can use any props that the component accepts
            inputProps: {
              hidden: true,
              type: "password",
              placeholder: "••••••••",
            },
          },
          gender: {
            inputProps: {
              placeholder: "Select gender",
              value: form?.getValues()?.gender || defaultValue?.gender,
              required: true,
            },

            fieldType: SelectFieldTypeWrapWithEnum(Object.values(GenderEnum)),
          },
          dob: {
            inputProps: {
              placeholder: "Select date of birth",
              required: true,
              disabledFromNow: true,
            },
          },
          firstName: {
            inputProps: {
              placeholder: "First name",
              required: true,
            },
          },
          lastName: {
            inputProps: {
              placeholder: "Last name",
              required: true,
            },
          },
          phone: {
            inputProps: {
              placeholder: "Phone number",
              required: true,
            },
          },
        }}
        // Optionally, define dependencies between fields
      >
        {/* 
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
        <AutoFormSubmit className="flex w-full items-center justify-center">
          {isUpdatePending ? <SpinnerIcon /> : "Submit"}
        </AutoFormSubmit>
      </AutoForm>
    </div>
  );
}
