import { ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react';
import { IconRight } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import type { Steppers } from '@/hooks/useStepper';
import { useBranchStepStore } from '@/stores/createBranchStore';

// import bg from "@/public/assets/images/bg1.avif";

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
const BranchCreation = ({ stepIndex, goBackfn, goNextFn, steppers }: Props) => {
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  useEffect(() => {
    setBranchStep({
      step: stepIndex,
      data: {},
    });
  }, []);

  return (
    <div className='relative flex size-full flex-col items-center justify-center backdrop-blur-3xl '>
      {/* <div className="absolute inset-0 -z-20 flex size-full items-center justify-center">
        <Image
          alt="bg"
          src={bg}
          className=" -z-10 h-full w-auto object-cover"
        />
      </div> */}

      <div className='flex w-full flex-1 items-start'>
        <div className='flex w-full items-center gap-4 '>
          {/* <Button
            className="mr-auto flex select-none items-center justify-center gap-2 px-4"
            disabled={stepIndex === 0}
            onClick={() => {
              goBackfn();
            }}
          >
            <ChevronLeft />
            Back
          </Button> */}

          <span className='flex flex-1 items-center justify-center text-xl font-semibold'>
            Step-{stepIndex}
            <IconRight /> Welcome to create your new pickleball branch.
          </span>
        </div>
      </div>
      <Button
        onClick={() => {
          goNextFn();
        }}
        className='flex w-full select-none items-center justify-center gap-2 px-4'
        disabled={stepIndex === steppers.length}
      >
        Next <ChevronRight />
      </Button>
    </div>
  );
};

export default BranchCreation;
