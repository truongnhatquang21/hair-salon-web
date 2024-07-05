import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import { getProfileAPI } from "@/apiCallers/auth";
import { getCourtListAPI } from "@/apiCallers/courts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const CreateButton = () => {
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => getProfileAPI(),
  });

  const { data: courtsData } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => getCourtListAPI(),
  });

  const availableCourts = useMemo(() => {
    if (!profileData?.data?.maxCourt) {
      return 0;
    }
    if (profileData.data.maxCourt) {
      return (
        profileData.data.maxCourt - (courtsData?.data?.length as number) || 0
      );
    }
    return 0;
  }, [profileData?.data?.maxCourt, courtsData?.data?.length]);

  const router = useRouter();
  console.log(profileData, "profileData");

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="flex items-center gap-2">
          <PlusCircleIcon />
          Add new
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Availability of your account reminder
          </AlertDialogTitle>
          <AlertDialogDescription>
            {availableCourts > 0 ? (
              <span className="">
                You have{" "}
                <span className="text-2xl font-bold text-black">
                  {availableCourts}
                </span>{" "}
                available to create, please click continue to create a new
                court. If you have any issue please contact support. Otherwise,
                if you want to create more courts, please upgrade your plan.
              </span>
            ) : (
              <span className="">
                You have reached{" "}
                <span className="text-xl font-bold text-black">
                  the maximum number of courts
                </span>{" "}
                you can create. If you want to create more courts, please
                upgrade your plan. Please contact support for more information.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {availableCourts > 0 && (
            <AlertDialogAction
              onClick={() => {
                router.push("/dashboard/branches/create");
              }}
            >
              Continue
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateButton;
