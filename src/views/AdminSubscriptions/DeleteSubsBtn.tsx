import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { toggleSubscriptionStatusAPI } from "@/apiCallers/adminSubcription";
import SpinnerIcon from "@/components/SpinnerIcon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  type PackageCourtSchemaTypeWithId,
  PackageCourtStatusEnum,
} from "./helper";

type Props = {
  defalutValues: PackageCourtSchemaTypeWithId;
  Trigger: React.ReactNode;
};

const DeleteSubsBtn = ({ defalutValues, Trigger }: Props) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: PackageCourtSchemaTypeWithId) =>
      toggleSubscriptionStatusAPI(data),
    onSuccess: (data) => {
      console.log(data);

      if (data.ok && !data.ok) {
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
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const prepareData = {
      ...defalutValues,
      status:
        defalutValues.status === PackageCourtStatusEnum.ACTIVE
          ? PackageCourtStatusEnum.INACTIVE
          : PackageCourtStatusEnum.ACTIVE,
    };
    try {
      await mutateAsync(prepareData);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="w-full">{Trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are toggling subscription status, please confirm your action
            before click on the confirm button.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="default"
            className="flex items-center justify-center"
            onClick={() => handleDelete()}
          >
            {isPending ? <SpinnerIcon /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubsBtn;
