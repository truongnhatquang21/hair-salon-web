import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { postCourtAPI, updateCourtAPI } from "@/apiCallers/courts";
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
import { useBranchStore } from "@/stores/branchStore";
import { CourtStatusEnum } from "@/types";

import { FileUploadFileTypeWithAccept } from "../branches/ImagesUpload";
import {
  type CourtSchemaType,
  type CourtSchemaTypeWithId,
  type CourtSchemaTypeWithId,
  createCourtObject,
} from "./helper";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: CourtSchemaTypeWithId;
  openDialog?: boolean;
  setOpenDialog?: (value: boolean) => void;
};
const CreateCourtButton = ({
  ButtonTrigger,
  isEdit,
  defaultValues,
  openDialog,
  setOpenDialog,
}: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CourtSchemaType>({
    defaultValues: defaultValues || {
      name: "",
      price: 0,
      description: "",
      status: CourtStatusEnum.INUSE,
      type: "",
      images: [],
    },
    resolver: zodResolver(createCourtObject),
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
      queryClient.invalidateQueries({
        queryKey: ["courts"],
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
  console.log(defaultValues, "defaultValues?.status");

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
            {isEdit ? "Update this court " : "Add new court"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the court details below."
              : "Fill in the form below to create a new court."}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            controlForm={form}
            values={defaultValues || form.getValues()}
            onSubmit={onSubmit}
            formSchema={createCourtObject}
            dependencies={[
              {
                sourceField: "type",
                targetField: "status",
                type: DependencyType.HIDES,
                when: () => !isEdit,
              },

              {
                sourceField: "type",
                targetField: "status",
                type: DependencyType.DISABLES,
                when: () =>
                  !!isEdit && defaultValues?.status === CourtStatusEnum.PENDING,
              },
            ]}
            fieldConfig={{
              name: {
                inputProps: {
                  placeholder: "--",
                  required: true,
                },
                description: "Name of court, e.g. 'Court 1'",
              },
              price: {
                inputProps: {
                  placeholder: "--",
                },
              },

              description: {
                inputProps: {
                  placeholder: "--",
                },
                fieldType: "textarea",
              },

              images: {
                inputProps: {
                  value: defaultValues?.images || [],
                },
                fieldType: FileUploadFileTypeWithAccept({
                  accept: {
                    "image/*": [".jpeg", ".png", `.jpg`],
                  },
                }),
              },

              status: {
                description: "Status of court, e.g. 'In use'",
                inputProps: {
                  placeholder: "Select status of court",
                  value: form.watch("status"),
                  defaultValue: defaultValues?.status || form.watch("status"),
                },
                fieldType: SelectFieldTypeWrapWithEnum(
                  Object.values(CourtStatusEnum)?.filter((item) =>
                    defaultValues?.status === CourtStatusEnum.PENDING
                      ? item === CourtStatusEnum.PENDING
                      : item !== CourtStatusEnum.PENDING
                  )
                ),
              },
              type: {
                inputProps: {
                  placeholder: "--",
                  value: form.watch("type"),
                },

                description: "Type of the court, e.g. 'Standard'",
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
                  {isEdit ? "Update court" : "Create court"}
                </Button>
              </AutoFormSubmit>
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourtButton;
