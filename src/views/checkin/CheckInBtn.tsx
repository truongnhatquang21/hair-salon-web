import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { checkInApi } from "@/apiCallers/checkIn";
import SpinnerIcon from "@/components/SpinnerIcon";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  id: string;
  invalidateKey?: string[];
};

const CheckInBtn = ({ id, invalidateKey }: Props) => {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (_id: string) => checkInApi({ id: _id }),
    onSuccess: (data) => {
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
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    },
  });
  const QueryClient = useQueryClient();
  const checkinHanle = async () => {
    try {
      await mutateAsync(id);
      if (invalidateKey) {
        QueryClient.invalidateQueries({
          queryKey: invalidateKey,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Button onClick={checkinHanle} className="flex justify-center">
      {isPending ? <SpinnerIcon /> : "Check In"}
    </Button>
  );
};

export default CheckInBtn;
