import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { banUSerAPI } from "@/apiCallers/Customer";
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
};

const BanButton = ({ id, Trigger }: Props) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: string) => banUSerAPI(data),
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
        className: "bg-green-600 text-white",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });

  const queryClient = useQueryClient();
  const handleSubmit = async (__id: string) => {
    try {
      await mutateAsync(__id);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["staffList"],
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
            This action cannot be undone. This will permanently inactive your
            your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="destructive"
            className="flex items-center justify-center"
            onClick={() => handleSubmit(id)}
          >
            {isPending ? <SpinnerIcon /> : "Ban user"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanButton;
