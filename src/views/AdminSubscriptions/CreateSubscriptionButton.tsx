import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import type { SubmitHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { postSubscriptionListAPI } from "@/apiCallers/adminSubcription";
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
import { PackageCourtTypeEnum } from "@/types";

import type { PackageCourtSchemaType } from "./helper";
import { createPackageCourtSchema } from "./helper";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: PackageCourtSchemaType;
  onClose?: () => void;
};
const CreateSubscriptionButton = ({
  onClose,
  ButtonTrigger,
  isEdit,
  defaultValues,
}: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<PackageCourtSchemaType>({
    defaultValues: defaultValues || {},
    resolver: zodResolver(createPackageCourtSchema),
    shouldFocusError: true,
  });
  const {
    setError,
    formState: { isDirty },
  } = form;
  const { mutateAsync: createSubscriptionMutating, isPending: createMutating } =
    useMutation({
      mutationFn: async (data: PackageCourtSchemaType) =>
        postSubscriptionListAPI(data),
      onSuccess: (data) => {
        console.log(data);

        if (data.ok && !data.ok) {
          if (data.error) {
            const errs = data.error as { [key: string]: { message: string } };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof PackageCourtSchemaType, {
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
    });
  const { mutateAsync: editSubscriptionMutating, isPending: editMutating } =
    useMutation({
      mutationFn: async (data: PackageCourtSchemaType) =>
        postSubscriptionListAPI(data),
      onSuccess: (data) => {
        console.log(data);

        if (data.ok && !data.ok) {
          if (data.error) {
            const errs = data.error as { [key: string]: { message: string } };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof PackageCourtSchemaType, {
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
    });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const onSubmit: SubmitHandler<PackageCourtSchemaType> = async (values) => {
    try {
      console.log(values, "OSDAOF");
      if (isEdit) {
        await editSubscriptionMutating(values);
      } else {
        await createSubscriptionMutating(values);
      }
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setIsDialogOpen(false);
      if (onClose) onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {ButtonTrigger || (
          <Button className="ml-auto flex items-center gap-2">
            <PlusCircleIcon />
            Add new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-3/5 flex-col overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update this subscription " : "Add new subscription"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the subscription details below."
              : "Fill in the form below to create a new subscription."}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            formControl={form}
            values={defaultValues}
            onSubmit={onSubmit}
            formSchema={createPackageCourtSchema}
            fieldConfig={{
              name: {
                inputProps: {
                  placeholder: "Standard Package",
                  required: true,
                },
                description: "Name of the package, e.g. 'Standard Package'",
              },
              totalPrice: {
                inputProps: {
                  placeholder: "1000",
                },
                description: "Total price of the package, e.g. '1000'",
              },
              priceEachCourt: {
                inputProps: {
                  placeholder: "100",
                },
                description: "Price per court of the package, e.g. '100'",
              },

              maxCourt: {
                inputProps: {
                  placeholder: "10",
                },
                description: "Maximum court of the package, e.g. '10'",
              },
              duration: {
                inputProps: {
                  placeholder: "2",
                },
                description: "Duration of the package, e.g. '2'",
              },
              description: {
                inputProps: {
                  placeholder: "This is a sample package",
                },
                fieldType: "textarea",
                description:
                  "Description of the package, e.g. 'This is a sample package'",
              },
              type: {
                inputProps: {
                  placeholder: "Select type of package",
                  value: defaultValues?.type,
                },

                fieldType: SelectFieldTypeWrapWithEnum(
                  Object.values(PackageCourtTypeEnum)
                ),
                description: "Type of the package, e.g. 'Standard'",
              },
            }}
          >
            <DialogFooter className="w-full">
              <AutoFormSubmit
                className="w-full"
                disabled={createMutating || editMutating}
              >
                <Button
                  type="submit"
                  className="flex w-full items-center gap-2"
                >
                  {(createMutating || editMutating) && <SpinnerIcon />}
                  {isEdit ? "Update subscription" : "Create subscription"}
                </Button>
              </AutoFormSubmit>
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubscriptionButton;
