"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BadgePlus,
  Clock,
  ContactRoundIcon,
  Images,
  Info,
  PersonStanding,
  PlayCircle,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import { getProfileAPI } from "@/apiCallers/auth";
import { getCourtListAPI } from "@/apiCallers/courts";
import Stepper from "@/components/stepper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Steppers } from "@/hooks/useStepper";
import useStepper from "@/hooks/useStepper";

import AvailableSlot from "./slide/AvailableSlot";
import BranchCreation from "./slide/BranchCreation";
import BranchDetails from "./slide/BranchDetails";
import Confirmation from "./slide/Confirmation";
import CourAvailability from "./slide/CourAvailability";
import CourtRegistration from "./slide/CourtRegistration";
import UplImagesUploader from "./slide/ImagesUploader";
import LisenseDetails from "./slide/LisenseDetails";
import WorkingTime from "./slide/WorkingTime";

export const CreateView = () => {
  const steppers: Steppers[] = [
    {
      icon: <BadgePlus />,
      label: "Branch Creation",
      key: "branch-creation",
    },

    {
      icon: <Wallet />,
      label: "Court availability",
      key: "court-availability",
    },
    {
      icon: <Info />,
      label: "Branch details",
      key: "branch-details",
    },
    {
      icon: <Images />,
      label: "Images",
      key: "images",
    },
    {
      icon: <ContactRoundIcon />,
      label: "Lisense details",
      key: "lisense-details",
    },
    {
      icon: <PlayCircle />,
      label: "Court registration",
      key: "court-registration",
    },
    {
      icon: <PersonStanding />,
      label: "Working Period",
      key: "working-period",
    },
    {
      icon: <Clock />,
      label: "Available slots",
      key: "available-slots",
    },
  ];

  const { activeStep, goBack, goNext } = useStepper({ steppers });
  const Silde = useMemo(() => {
    switch (steppers[activeStep]?.key) {
      case "branch-creation":
        return (
          <BranchCreation
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "court-availability":
        return (
          <CourAvailability
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "branch-details":
        return (
          <BranchDetails
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "images":
        return (
          <UplImagesUploader
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "lisense-details":
        return (
          <LisenseDetails
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "court-registration":
        return (
          <CourtRegistration
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "available-slots":
        return (
          <AvailableSlot
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      case "working-period":
        return (
          <WorkingTime
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
      default:
        return (
          <Confirmation
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
          />
        );
    }
  }, [activeStep]);
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
  return (
    <div className="relative flex size-full flex-col  gap-2  overflow-auto">
      <Stepper steppers={steppers} activeStep={activeStep} />
      <div className="relative w-[600px] flex-1  self-center overflow-auto rounded-lg xl:w-[800px]  ">
        {Silde}
      </div>
      <AlertDialog open={availableCourts === 0}>
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
                  court. If you have any issue please contact support.
                  Otherwise, if you want to create more courts, please upgrade
                  your plan.
                </span>
              ) : (
                <span className="">
                  You have reached{" "}
                  <span className="text-xl font-bold text-black">
                    the maximum number of courts
                  </span>{" "}
                  you can create. If you want to create more courts, please
                  upgrade your plan. Please contact support for more
                  information.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                router.push("/dashboard/branches");
              }}
            >
              Go back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
