/* eslint-disable no-underscore-dangle */
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { formatToVND } from '@/app/[locale]/(normalUser)/(auth)/subscriptions/helper';
import CalendarDaily from '@/components/Custom/DailyCalendar';
import CustomTag from '@/components/CustomTag';
import { EmptyComponent } from '@/components/Empty';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { ICourt } from '@/interfaces/court.interface';
import { useBookingStore } from '@/stores/bookingStore';

interface CalendarDailyProps {
  setSelectDay: Dispatch<SetStateAction<Date | undefined>>;
  courts: ICourt[];
  selectedCourt: ICourt | null;
  handleCourtSelection: (court: ICourt) => void;
  setStartSlot: Dispatch<SetStateAction<null>>;
  startSlot: string | null;
  endSlot: string | null;
  selectedSlots: string[] | null;
  setEndSlot: Dispatch<SetStateAction<null>>;
  setSelectedSlots?: Dispatch<SetStateAction<[]>>;
  setSelectedCourts?: Dispatch<SetStateAction<[]>>;

  selectDay: Date | undefined;
  activeTab: string;
}

const FormSchema = z.object({
  hours: z.coerce
    .number()
    .min(0, { message: 'Hours cannot be negative.' })
    .max(50, { message: 'Hours cannot exceed 50.' }),
});

const FlexibleBooking = ({
  setSelectedSlots,
  setSelectDay,
  courts,
  selectedCourt,
  handleCourtSelection,
  setStartSlot,
  selectedSlots,
  startSlot,
  endSlot,
  setEndSlot,
  selectDay,
  activeTab,
  setSelectedCourts,
}: CalendarDailyProps) => {
  console.log('selectDay', selectDay);
  console.log(courts, 'PDSPF');

  const { toast } = useToast();
  const router = useRouter();
  const { setBooking } = useBookingStore((state) => {
    return {
      setBooking: state.setBookingData,
    };
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hours: 0,
    },
  });

  const handleBooking = async () => {
    const isValid = form.getValues();

    if (isValid.hours > 0 && isValid.hours < 51) {
      if (activeTab === 'flexible_schedule') {
        setBooking({
          booking: {
            type: activeTab,
            paymentType: 'haft',
            paymentMethod: 'vnpay',
            totalPrice: selectedCourt?.price * isValid.hours,
            totalHour: isValid.hours,
            startDate: format(selectDay.toString(), 'yyyy-MM-dd'),
            endDate: format(selectDay.toString(), 'yyyy-MM-dd'),
            court: selectedCourt,
          },
        });
        router.push('/booking');
      }
    } else {
      form.setError('hours', {
        message: 'Hours Is not valid!, It must between 0 and 50',
      });
    }
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <Form {...form}>
        <CalendarDaily
          setSelectedSlots={setSelectedSlots}
          setSelectedCourts={setSelectedCourts}
          setDay={setSelectDay}
          setEndSlot={setEndSlot}
          setStartSlot={setStartSlot}
        />

        <FormField
          control={form.control}
          name='hours'
          render={({ field }) => (
            <FormItem className='grid grid-cols-2 items-center gap-4'>
              <FormLabel className=' text-right'>
                <span className='text-xl font-bold'>Hour</span>
              </FormLabel>
              <div className=''>
                <FormControl>
                  <Input
                    placeholder='shadcn'
                    type='number'
                    className='w-1/2'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please estimate hour for this court.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {selectDay && (
          <div className='mx-auto mt-6 max-w-2xl'>
            <h3 className='mb-2 text-lg font-bold'>Select Court</h3>

            {courts?.length === 0 ? (
              <EmptyComponent
                title='No Court Available'
                // description="You haven't made any bookings yet. Start booking now to manage your reservations."
                className='w-full'
              />
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {courts?.map((value: ICourt) => {
                  console.log(value, 'PDSPF');

                  if (value.status === 'Inuse') {
                    return (
                      <Card
                        key={value._id}
                        className={`cursor-pointer ${
                          selectedCourt !== null &&
                          selectedCourt._id === value._id
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleCourtSelection(value)}
                      >
                        <CardContent className='grid gap-4 overflow-hidden p-5'>
                          <div className='flex items-center gap-4'>
                            <div
                              className={`cursor-pointer rounded-lg object-cover p-2 ${
                                selectedCourt !== null &&
                                selectedCourt._id === value._id
                                  ? ' bg-slate-500 stroke-white '
                                  : ' border-white text-white '
                              }`}
                            >
                              <Icons.badmintonCourt className='rounded-lg object-cover' />
                            </div>
                            <div>
                              <h3 className='font-semibold'>{value.name}</h3>
                              <span
                                className={`line-clamp-3 text-sm ${
                                  selectedCourt !== null &&
                                  selectedCourt._id === value._id
                                    ? ' text-slate-300 dark:text-slate-200 '
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {value.description}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                              <CustomTag status={value.status} />
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                selectedCourt !== null &&
                                selectedCourt._id === value._id
                                  ? ' text-slate-300 dark:text-slate-200 '
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              <UsersIcon className='size-4' />
                              <span>type: {value.type}</span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                selectedCourt !== null &&
                                selectedCourt._id === value._id
                                  ? ' text-slate-300 dark:text-slate-200 '
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {/* <DollarSignIcon className="size-4" /> */}
                              <span>{formatToVND(value.price)} / slot</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </div>
            )}
          </div>
        )}

        <div className='mt-6 flex justify-end'>
          <Button
            variant='default'
            className='rounded-md px-6 py-2'
            disabled={selectedCourt == null}
            onClick={handleBooking}
          >
            {/* {bookingMutating && <SpinnerIcon />} */}
            Book Selected courts
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FlexibleBooking;
