import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
  postSubscriptionListAPI,
  putSubscriptionListAPI,
} from "@/apiCallers/adminSubcription";
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
import { PackageCourtTypeEnum } from "@/types";

import type {
  PackageCourtSchemaType,
  PackageCourtSchemaTypeWithId,
} from "./helper";
import {
  createPackageCourtSchema,
  PackageCourtStatusEnum,
  PackageEnum,
} from "./helper";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: PackageCourtSchemaTypeWithId;
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
    defaultValues: defaultValues || {
      duration: 1,
    },
    resolver: zodResolver(createPackageCourtSchema),
    shouldFocusError: true,
    mode: "onChange",
  });
  const { setError } = form;

  const { mutateAsync: createSubscriptionMutating, isPending: createMutating } =
    useMutation({
      mutationFn: async (data: PackageCourtSchemaType) => {
        return postSubscriptionListAPI(data);
      },
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
      mutationFn: async (data: PackageCourtSchemaTypeWithId) => {
        console.log(data);
        return putSubscriptionListAPI(data);
      },
      onSuccess: (data) => {
        if (!data.ok) {
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
    console.log("values", values, "render");

    try {
      if (isEdit) {
        const prepareData = {
          ...values,
          _id: defaultValues?._id,
        };
        console.log(prepareData, "oasdo");
        await editSubscriptionMutating(prepareData);
      } else {
        await createSubscriptionMutating(values);
        console.log("render");
      }
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setIsDialogOpen(false);
      // if (onClose) onClose();
    } catch (e) {
      console.log(e);
    }
  };
  // const typePackage = form.watch("type");
  // useEffect(() => {
  //   if (typePackage === PackageCourtTypeEnum.CUSTOM) {
  //     form.setValue("duration", 1);
  //   }
  // }, [typePackage]);
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
            <div className="w-full rounded-md bg-yellow-500 p-2 text-white shadow-md">
              {isEdit ? (
                <span>
                  View and Update the subscription details below. Make sure to
                  fill in all the required fields and <b>Active</b> your
                  subscription to make it available for the users.
                </span>
              ) : (
                <span>
                  Add new subscription details below. Make sure to fill in all
                  the required fields. Subscription has <b>inactive</b> status
                  by default. After you create the subscription, you can
                  activate it to make it available for the users.
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            controlForm={form}
            values={defaultValues || form.getValues()}
            onSubmit={onSubmit}
            formSchema={createPackageCourtSchema}
            dependencies={[
              {
                // "age" hides "parentsAllowed" when the age is 18 or older
                sourceField: "type",
                type: DependencyType.HIDES,
                targetField: "totalPrice",
                when: (type: PackageEnum) => type !== PackageEnum.Standard,
              },
              {
                // "age" hides "parentsAllowed" when the age is 18 or older
                sourceField: "type",
                type: DependencyType.HIDES,
                targetField: "priceEachCourt",
                when: (type: PackageEnum) => type === PackageEnum.Standard,
              },
              {
                // "age" hides "parentsAllowed" when the age is 18 or older
                sourceField: "type",
                type: DependencyType.HIDES,
                targetField: "maxCourt",
                when: (type: PackageEnum) => type !== PackageEnum.Standard,
              },
              // {
              //   // "age" hides "parentsAllowed" when the age is 18 or older
              //   sourceField: "type",
              //   type: DependencyType.DISABLES,
              //   targetField: "duration",
              //   when: (type: PackageEnum) => type === PackageEnum.Custom,
              // },
              {
                sourceField: "type",
                targetField: "status",
                type: DependencyType.HIDES,
                when: () => !isEdit,
              },
            ]}
            fieldConfig={{
              name: {
                inputProps: {
                  placeholder: "--",
                  required: true,
                },
                description: "Name of the package, e.g. 'Standard Package'",
              },
              totalPrice: {
                inputProps: {
                  placeholder: "--",
                },
                description: "Total price of the package, e.g. '1000'",
              },
              priceEachCourt: {
                inputProps: {
                  placeholder: "--",
                },
                description: "Price per court of the package, e.g. '100'",
              },

              maxCourt: {
                inputProps: {
                  placeholder: "--",
                },
                description: "Maximum court of the package, e.g. '10'",
              },
              duration: {
                inputProps: {
                  placeholder: "--",
                  defaultValue: 1,
                },
                description: "Duration of the package, e.g. '1'",
              },
              description: {
                inputProps: {
                  placeholder: "--",
                },
                fieldType: "textarea",
                description:
                  "Description of the package, e.g. 'This is a sample package'",
              },
              status: {
                description: "Status of the package",
                inputProps: {
                  placeholder: "Select status of package",
                  value: form.watch("status"),
                  defaultValue: "inactive",
                },
                fieldType: SelectFieldTypeWrapWithEnum(
                  Object.values(PackageCourtStatusEnum)
                ),
              },
              type: {
                inputProps: {
                  placeholder: "Select type of package",
                  value: form.watch("type"),
                  disabled: isEdit,
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
