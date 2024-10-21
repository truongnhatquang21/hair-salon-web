import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { IconRight } from 'react-day-picker';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getProfileAPI } from '@/apiCallers/auth';
import { getCourtListAPI } from '@/apiCallers/courts';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Steppers } from '@/hooks/useStepper';
import { useBranchStepStore } from '@/stores/createBranchStore';

type Props = {
  stepIndex: number;
  goNextFn: (number?: number) => void;
  goBackfn: (number?: number) => void;
  steppers: Steppers[];
};
export const amountFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount is required')

    .describe('Amount of court'),
});
export type SchemaType = z.infer<typeof amountFormSchema>;
const CourAvailability = ({
  goBackfn,
  steppers,
  stepIndex,
  goNextFn,
}: Props) => {
  const { toast } = useToast();
  const { branchStep, setBranchStep } = useBranchStepStore((state) => {
    return {
      branchStep: state.stepStore,
      setBranchStep: state.setStore,
    };
  });
  const initialValues = (branchStep.find((step) => step.step === stepIndex)
    ?.data || {
    amount: 1,
  }) as SchemaType;
  const form = useForm<SchemaType>({
    resolver: zodResolver(amountFormSchema),
    values: initialValues,
    shouldFocusError: true,
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Please check your form again',
      });
    }
    setBranchStep({
      step: stepIndex,
      data,
    });
    toast({
      title: 'Success',
      description:
        'Your data has been saved in draft, if you want to continue please click next button',
      className: 'bg-green-600 text-white',
    });
    goNextFn(stepIndex + 1);
    console.log(branchStep, 'branchStep');
  };

  const { data: profileData } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => getProfileAPI(),
  });

  const { data: courtsData } = useQuery({
    queryKey: ['courts'],
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
  return (
    <div className='flex size-full flex-col gap-4'>
      <div className='flex w-full items-center gap-4'>
        <Button
          className='mr-auto flex select-none items-center justify-center gap-2 px-4'
          disabled={stepIndex === 0}
          onClick={() => {
            goBackfn();
          }}
        >
          <ChevronLeft />
          Back
        </Button>

        <span className='flex flex-1 items-center justify-center text-center text-xl font-semibold'>
          Step-{stepIndex}
          <IconRight />{' '}
          <h1 className='text-center text-2xl font-bold uppercase'>
            Services Availability
          </h1>
        </span>
      </div>

      <div className='flex items-center gap-4 text-sm'>
        <span className='text-3xl text-destructive'>*</span>
        <span>
          You must create <b className='text-xl'>1</b> service availability
        </span>
      </div>
      <div className='flex w-full items-center border-t p-2'>
        <AutoForm
          onSubmit={onSubmit}
          controlForm={form}
          values={form.getValues()}
          formSchema={amountFormSchema}
          fieldConfig={{
            amount: {
              label: 'Amount of services',
              inputProps: {
                type: 'number',
                placeholder: 'Amount of services',
                max: availableCourts,
              },
              description: 'Amount of services you want to create in advance',
            },
          }}
        >
          <AutoFormSubmit className='w-full'>
            <Button
              type='submit'
              className='flex w-full select-none items-center justify-center gap-2 px-4'
              disabled={stepIndex === steppers.length}
            >
              Next <ChevronRight />
            </Button>
          </AutoFormSubmit>
        </AutoForm>
      </div>
    </div>
  );
};

export default CourAvailability;
