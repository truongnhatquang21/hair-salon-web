import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
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
import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branchStore";
import { CourtStatusEnum } from "@/types";

import { BranchStatusEnum } from "../branches/helper";
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
  const viewOnly = selectedBranch?.status === BranchStatusEnum.DENIED;
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
            {viewOnly
              ? "View this court"
              : isEdit
                ? "Update this court "
                : "Add new court"}
          </DialogTitle>
          <DialogDescription>
            <div
              className={cn(
                "w-full text-white p-2 rounded-md shadow-md",
                selectedBranch?.status === BranchStatusEnum.PENDING &&
                  "bg-yellow-500",
                selectedBranch?.status === BranchStatusEnum.INACTIVE &&
                  "bg-blue-500",
                selectedBranch?.status === BranchStatusEnum.ACTIVE &&
                  "bg-green-500",
                selectedBranch?.status === BranchStatusEnum.DENIED &&
                  "bg-red-500"
              )}
            >
              <h3 className="text-lg font-semibold">
                Instructions of <b>{selectedBranch?.status}</b> branch
              </h3>
              <p className="text-sm">
                {selectedBranch?.status === BranchStatusEnum.PENDING &&
                  "This branch is pending for approval. You can create or update court but it will not be visible to public"}
                {selectedBranch?.status === BranchStatusEnum.INACTIVE &&
                  "This branch is inactive. You can create or update court but it will not be visible to public"}
                {selectedBranch?.status === BranchStatusEnum.ACTIVE &&
                  "This branch is active. You can create or update court and it will be visible to public"}
                {selectedBranch?.status === BranchStatusEnum.DENIED &&
                  "This branch is denied. You can't create or update court and it will not be visible to public"}
              </p>
            </div>
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
                  placeholder: "Court name",
                  required: true,
                  readOnly: viewOnly,
                },
              },
              price: {
                inputProps: {
                  placeholder: "Price of court",
                  required: true,
                  readOnly: viewOnly,
                },
              },

              description: {
                inputProps: {
                  readOnly: viewOnly,
                  placeholder:
                    "Type description of court, e.g. 'Standard court'",
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
                  readOnly: viewOnly,
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
                  readOnly: viewOnly,
                  placeholder: "Type of court",
                  value: form.watch("type"),
                },
              },
            }}
          >
            <DialogFooter className="w-full">
              {viewOnly ? (
                <DialogClose className="w-full">
                  <Button className="w-full" type="button">
                    Close
                  </Button>
                </DialogClose>
              ) : (
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
              )}
            </DialogFooter>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourtButton;
