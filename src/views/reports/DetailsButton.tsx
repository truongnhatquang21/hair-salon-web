import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { getProfileAPI } from "@/apiCallers/auth";
import { getCourtByBranchIdAPI } from "@/apiCallers/courts";
import {
  getReportByBranchAPI,
  postReportAPI,
  updateReportAPI,
} from "@/apiCallers/report";
import {
  SelectFieldTypeWrapWithEnum,
  SelectFieldTypeWrapWithOptions,
} from "@/components/SelectFieldTypeComp";
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
import { CourtReportStatus } from "@/types";

import { FileUploadFileTypeWithAccept } from "../branches/ImagesUpload";
import type {
  CreateReportSchemaType,
  CreateReportSchemaTypeWithId,
} from "./help";
import { createReportSchema } from "./help";

type Props = {
  ButtonTrigger?: React.ReactNode;
  isEdit?: boolean;
  defaultValues?: CreateReportSchemaTypeWithId;
  openDialog?: boolean;
  setOpenDialog?: (value: boolean) => void;
  isView?: boolean;
  selectedCourt?: string;
};
const DetailButton = ({
  selectedCourt,
  ButtonTrigger,
  isEdit,
  defaultValues,
  openDialog,
  setOpenDialog,
  isView,
}: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CreateReportSchemaType>({
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          court: defaultValues.court?._id,
          creator: defaultValues.creator?.email,
        }
      : {},
    resolver: zodResolver(createReportSchema),
    shouldFocusError: true,
    mode: "onChange",
  });
  const { setError } = form;
  useEffect(() => {
    if (!isEdit && !isView)
      form.setValue(
        "court",
        selectedCourt === "all" ? "" : selectedCourt || ""
      );
  }, [selectedCourt]);

  const selectedBranch = useBranchStore((state) => state.branch);
  const { data, isLoading } = useQuery({
    queryKey: ["ReportList", selectedBranch?._id || ""],
    queryFn: async () =>
      getReportByBranchAPI({ branchId: selectedBranch?._id || "" }),
  });

  const { data: CourtList } = useQuery({
    queryKey: ["myCourtList", (selectedBranch?._id as string) || ""],
    queryFn: async () => getCourtByBranchIdAPI(selectedBranch?._id as string),
  });

  const courtOptions = useMemo(() => {
    return (CourtList?.data || []).map((court) => ({
      label: court.name,
      value: court._id,
    }));
  }, [CourtList?.data]);

  const { mutateAsync: createTrigger, isPending: createMutating } = useMutation(
    {
      mutationFn: async (dataForm: CreateReportSchemaType) => {
        return postReportAPI(dataForm);
      },
      onSuccess: (dataRes) => {
        if (!dataRes.ok) {
          if (dataRes.error) {
            const errs = dataRes.error as {
              [key: string]: { message: string };
            };
            Object.entries(errs).forEach(([key, value]) => {
              setError(key as keyof CreateReportSchemaType, {
                type: "manual",
                message: value.message,
              });
            });
          }

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: dataRes.message || dataRes.statusText,
          });

          throw new Error(dataRes.message || dataRes.statusText);
        }

        if (dataRes.message) {
          return toast({
            variant: "default",
            className: "bg-green-600 text-white",
            title: "Message from system",
            description: dataRes.message,
          });
        }

        return toast({
          variant: "default",
          title: "Submitted successfully",
          description: "You can do something else now",
        });
      },
    }
  );
  const { mutateAsync: editTrigger, isPending: editMutating } = useMutation({
    mutationFn: async (dataForm: CreateReportSchemaTypeWithId) => {
      return updateReportAPI(dataForm);
    },
    onSuccess: (dataRes) => {
      if (!dataRes.ok) {
        if (dataRes.error) {
          const errs = dataRes.error as { [key: string]: { message: string } };
          Object.entries(errs).forEach(([key, value]) => {
            setError(key as keyof CreateReportSchemaTypeWithId, {
              type: "manual",
              message: value.message,
            });
          });
        }

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: dataRes.message || dataRes.statusText,
        });

        throw new Error(dataRes.message || dataRes.statusText);
      }

      if (dataRes.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: dataRes.message,
        });
      }

      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const onSubmit: SubmitHandler<CreateReportSchemaType> = async (values) => {
    if (!isView && !isEdit) form.setValue("creator", profileData?.data?._id);
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
        };

        await editTrigger(prepareData);
      } else {
        const prepareData = {
          ...values,
          creator: profileData?.data?._id,
        };
        console.log("prepareData", prepareData);

        await createTrigger(prepareData);
      }
      queryClient.invalidateQueries({
        queryKey: ["ReportList", selectedBranch?._id || ""],
      });
      setOpenDialog && setOpenDialog(false);
      setIsDialogOpen(false);
      form.reset();
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
                ? "View and Update this report "
                : "Add new report"}
          </DialogTitle>
          <DialogDescription>
            {isView
              ? "View details of report"
              : isEdit
                ? "View and Update the report details below."
                : "Add new report"}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 overflow-auto p-2">
          <AutoForm
            controlForm={form}
            values={
              defaultValues
                ? {
                    ...defaultValues,
                    court: defaultValues.court?._id,
                    creator: defaultValues.creator?._id,
                  }
                : form.getValues()
            }
            // onSubmit={onSubmit}
            formSchema={createReportSchema}
            dependencies={[
              {
                sourceField: "court",
                targetField: "creator",
                type: DependencyType.HIDES,
                when: () => !isEdit && !isView,
              },
            ]}
            fieldConfig={{
              creator: {
                inputProps: {
                  placeholder: "Select creator",
                  readOnly: isEdit || isView,
                },
              },
              court: {
                inputProps: {
                  placeholder: "Select court",
                  defaultValue: defaultValues?.court?._id,
                },
                fieldType: SelectFieldTypeWrapWithOptions(courtOptions),
              },
              description: {
                inputProps: {
                  placeholder: "Description",
                },
                fieldType: "textarea",
              },
              status: {
                inputProps: {
                  placeholder: "Select status",
                  value: form.getValues().status,
                  defaultValue: defaultValues?.status,
                },
                fieldType: SelectFieldTypeWrapWithEnum(
                  isEdit
                    ? Object.values(CourtReportStatus)
                    : Object.values(CourtReportStatus).filter(
                        (item) =>
                          item !== CourtReportStatus.DENIED &&
                          item !== CourtReportStatus.PENDING
                      )
                ),
              },
              images: {
                inputProps: {
                  value: form.getValues().images,
                },
                fieldType: FileUploadFileTypeWithAccept({
                  accept: {
                    "image/*": [".jpeg", ".png", `.jpg`],
                  },
                }),
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
                    {isEdit ? "Update" : "Create"}
                  </Button>
                </AutoFormSubmit>
              ) : (
                <DialogClose className="flex w-full items-center justify-center">
                  <Button className="w-full" type="button">
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
