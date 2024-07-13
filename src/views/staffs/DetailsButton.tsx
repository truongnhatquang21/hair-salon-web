import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { getProfileAPI } from "@/apiCallers/auth";
import { updateCourtAPI } from "@/apiCallers/courts";
import { postCreateStaffAPI } from "@/apiCallers/staff";
import { SelectFieldTypeWrapWithEnum } from "@/components/SelectFieldTypeComp";
import SpinnerIcon from "@/components/SpinnerIcon";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useBranchStore } from "@/stores/branchStore";
import { RoleEnum, UserStatusEnum } from "@/types";

import type { CourtSchemaType, CourtSchemaTypeWithId } from "../courts/helper";
import { createManagerSchema } from "../manger/helper";
import type {
  CreateStaffSchemaType,
  CreateStaffSchemaType,
  CreateStaffSchemaTypeWithId,
} from "./help";
import { createStaffSchema } from "./help";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: CreateStaffSchemaTypeWithId;
  openDialog?: boolean;
  setOpenDialog?: (value: boolean) => void;
  isView?: boolean;
};
const DetailButton = ({
  ButtonTrigger,
  isEdit,
  defaultValues,
  openDialog,
  setOpenDialog,
  isView,
}: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CreateStaffSchemaType>({
    defaultValues: defaultValues || {
      role: RoleEnum.STAFF,
      status: UserStatusEnum.ACTIVE,
    },
    resolver: zodResolver(createManagerSchema),
    shouldFocusError: true,
    mode: "onChange",
  });
  const { setError } = form;

  const { mutateAsync: createStaffTrigger, isPending: createMutating } =
    useMutation({
      mutationFn: async (
        data: CreateStaffSchemaTypeWithId & {
          branch: string;
          manager: string;
        }
      ) => {
        return postCreateStaffAPI(data);
      },
      onSuccess: (data) => {
        if (!data.ok) {
          if (data.error) {
            const errs = data.error as { [key: string]: { message: string } };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof CreateStaffSchemaType, {
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
  const { mutateAsync: editCourtTrigger, isPending: editMutating } =
    useMutation({
      mutationFn: async (data: CourtSchemaTypeWithId) => {
        return updateCourtAPI(data);
      },
      onSuccess: (data) => {
        if (!data.ok) {
          if (data.error) {
            const errs = data.error as { [key: string]: { message: string } };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof CourtSchemaType, {
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

  const selectedBranch = useBranchStore((state) => state.branch);
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const onSubmit: SubmitHandler<CreateStaffSchemaType> = async (values) => {
    const isValidate = await form.trigger();
    if (!isValidate) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please check the form again",
      });
      return;
    }

    try {
      if (isEdit) {
        const prepareData = {
          ...values,
          _id: defaultValues?._id,
        };

        await editCourtTrigger(prepareData);
      } else {
        const prepareData = {
          ...values,
          branch: selectedBranch?._id,
          manager: profileData?.data?._id as string,
        };
        console.log("prepareData", prepareData);

        await createStaffTrigger(prepareData);
      }
      queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });
      form.reset();
      setOpenDialog && setOpenDialog(false);
      setIsDialogOpen(false);
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
  const isReadOnly = isView;
  useEffect(() => {
    if (!isDialogOpen) {
      if (isEdit || isView) {
        form.reset();
      }
    }
  }, [isDialogOpen, isEdit, form, isView]);
  return (
    <Dialog
      open={openDialog || isDialogOpen}
      onOpenChange={setOpenDialog || setIsDialogOpen}
    >
      <DialogTrigger asChild>
        {ButtonTrigger || (
          <Button className="ml-auto flex items-center gap-2">
            <PlusCircleIcon />
            Add new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className=" flex h-3/5 flex-col  sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isView
              ? "View Details"
              : isEdit
                ? "Update this staff details."
                : "Add new staff details."}
          </DialogTitle>
          <DialogDescription>
            <div className="w-full rounded-md bg-yellow-500 p-2 text-white shadow-md">
              <b>Warning:</b>
              {isView
                ? " You are viewing this staff details. You can't edit this. Please ask the owner to edit."
                : isEdit
                  ? " You are updating this staff details."
                  : " You are adding new staff details. Please fill in the form below. After that, click the submit button to save. You can't edit this after submit. If you want to edit, please ask the owner to edit."}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            controlForm={form}
            values={defaultValues || form.getValues()}
            // onSubmit={onSubmit}
            formSchema={createStaffSchema}
            dependencies={[
              {
                sourceField: "role",
                targetField: "status",
                type: DependencyType.HIDES,
                when: () => !isEdit && !isView,
              },
              {
                sourceField: "role",
                targetField: "password",
                type: DependencyType.HIDES,
                when: () => !!isEdit || !!isView,
              },
            ]}
            fieldConfig={{
              username: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "staff123",
                },
              },
              email: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "staff@gmail.com",
                },
              },
              status: {
                inputProps: {
                  disabled: isReadOnly,
                  readOnly: isReadOnly,
                  placeholder: "Select status",
                },
              },
              role: {
                inputProps: {
                  disabled: true,
                  defaultValue: RoleEnum.STAFF,
                  value: defaultValues?.role || form.getValues().role,
                },
                fieldType: SelectFieldTypeWrapWithEnum(Object.values(RoleEnum)),
              },
              dob: {
                inputProps: {
                  readOnly: isReadOnly,
                  disabled: isReadOnly,
                  disabledFromNow: true,
                  placeholder: "Select date of birth",
                },
              },
              firstName: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "Staff first name",
                },
              },
              lastName: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "Staff last name",
                },
              },
              phone: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "0123456789",
                },
              },
              gender: {
                inputProps: {
                  disabled: isReadOnly,
                  readOnly: isReadOnly,
                  placeholder: "Select gender",
                },
              },
              password: {
                inputProps: {
                  // disabled: isReadOnly,
                  readOnly: isReadOnly,
                  placeholder: "Password",
                  type: "password",
                },
              },
            }}
          >
            <DialogFooter className="w-full">
              {!isView ? (
                <AutoFormSubmit
                  className="w-full"
                  disabled={createMutating || editMutating}
                >
                  <Button
                    type="submit"
                    onClick={() => {
                      onSubmit(form.getValues());
                    }}
                    className="flex w-full items-center gap-2"
                  >
                    {(createMutating || editMutating) && <SpinnerIcon />}
                    {isEdit ? "Update staff" : "Create staff"}
                  </Button>
                </AutoFormSubmit>
              ) : (
                <DialogClose className="flex w-full items-center justify-center">
                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    <span className="sr-only">Close</span>Close
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailButton;
