import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { deleteReportAPI } from "@/apiCallers/report";
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
import { useBranchStore } from "@/stores/branchStore";

type Props = {
  id: string;
  Trigger: React.ReactNode;
};

const DeleteSubsBtn = ({ id, Trigger }: Props) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: string) => deleteReportAPI(data),
    onSuccess: (data) => {
      console.log(data);

      if (!data.ok) {
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
  const queryClient = useQueryClient();
  const handleDelete = async (__id: string) => {
    try {
      await mutateAsync(__id);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["ReportList", selectedBranch?._id || ""],
      });
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
            This action cannot be undone. This will permanently delete your your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="destructive"
            className="flex items-center justify-center"
            onClick={() => handleDelete(id)}
          >
            {isPending ? <SpinnerIcon /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubsBtn;
