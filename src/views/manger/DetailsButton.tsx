import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { postCourtAPI, updateCourtAPI } from "@/apiCallers/courts";
import AutoForm from "@/components/ui/auto-form";
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
import { useBranchStore } from "@/stores/branchStore";

import type { CourtSchemaType, CourtSchemaTypeWithId } from "../courts/helper";
import { createManagerSchema, type CreateManagerSchemaType } from "./helper";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: CourtSchemaTypeWithId;
  openDialog?: boolean;
  setOpenDialog?: (value: boolean) => void;
};
const DetailButton = ({
  ButtonTrigger,
  isEdit,
  defaultValues,
  openDialog,
  setOpenDialog,
}: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CreateManagerSchemaType>({
    defaultValues: defaultValues || {},
    resolver: zodResolver(createManagerSchema),
    shouldFocusError: true,
    mode: "onChange",
  });
  const { setError } = form;

  const { mutateAsync: createCourtTrigger, isPending: createMutating } =
    useMutation({
      mutationFn: async (data: CourtSchemaTypeWithId) => {
        return postCourtAPI(data);
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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const onSubmit: SubmitHandler<CourtSchemaType> = async (values) => {
    console.log("values", values);

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
        };
        await createCourtTrigger(prepareData);
      }
      queryClient.invalidateQueries({
        queryKey: ["myCourtList", (selectedBranch?._id as string) || ""],
      });
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
  const isReadOnly = true;
  console.log("defaultValues", defaultValues);
  useEffect(() => {
    if (!isDialogOpen) {
      if (isEdit || isReadOnly) {
        form.reset();
      }
    }
  }, [isDialogOpen, isEdit, form]);
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
          <DialogTitle>View Details</DialogTitle>
          <DialogDescription>
            <div className="w-full rounded-md bg-yellow-500 p-2 text-white shadow-md">
              <b>Instruction: </b>
              You only can view the details of this account. If you want to
              edit, please ask the owner of this account.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            controlForm={form}
            values={defaultValues || form.getValues()}
            // onSubmit={onSubmit}

            formSchema={createManagerSchema}
            fieldConfig={{
              username: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "manager123",
                },
              },
              email: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "manager@gmail.com",
                },
              },
              status: {
                inputProps: {
                  readOnly: isReadOnly,
                  disabled: isReadOnly,
                  placeholder: "Select status",
                },
              },
              role: {
                inputProps: {
                  readOnly: isReadOnly,
                  disabled: isReadOnly,
                  placeholder: "Select role",
                },
              },
              dob: {
                inputProps: {
                  readOnly: isReadOnly,

                  disabled: true,
                },
              },
              firstName: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "Manager",
                },
              },
              lastName: {
                inputProps: {
                  readOnly: isReadOnly,
                  placeholder: "Manager",
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
                  readOnly: isReadOnly,
                  disabled: isReadOnly,
                  placeholder: "Select gender",
                },
              },
              // payments: {
              //   inputProps: {
              //     hidden: true,
              //   },
              // },
            }}
          >
            <DialogFooter className="w-full">
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
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailButton;
