import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { deleteSlotApi } from "@/apiCallers/slot";
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

type Props = {
  id: string;
  Trigger: React.ReactNode;
  invalidateKey?: string[];
};

const DeleteSubsBtn = ({ id, Trigger, invalidateKey }: Props) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: string) => deleteSlotApi(data),
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
  const handleDelete = async (__id: string) => {
    try {
      await mutateAsync(__id);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        {Trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="destructive"
            className="flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(id);
            }}
          >
            {isPending ? <SpinnerIcon /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubsBtn;
