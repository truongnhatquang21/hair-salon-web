"use client";

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
import React, { useMemo } from "react";

import Stepper from "@/components/stepper";
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
  return (
    <div className="relative flex size-full flex-col  gap-2  overflow-auto">
      <Stepper steppers={steppers} activeStep={activeStep} />
      <div className="relative w-[600px] flex-1  self-center overflow-auto rounded-lg xl:w-[800px]  ">
        {Silde}
      </div>
    </div>
  );
};
