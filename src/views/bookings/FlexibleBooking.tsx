/* eslint-disable no-underscore-dangle */
import { UsersIcon } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

import CalendarDaily from "@/components/Custom/DailyCalendar";
import CustomTag from "@/components/CustomTag";
import { Icons } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { ICourt } from "@/interfaces/court.interface";
import type { ISlot } from "@/interfaces/slot.interface";

interface CalendarDailyProps {
  setSelectDay: Dispatch<SetStateAction<Date | undefined>>;
  courts: ICourt[];
  selectedCourt: ICourt | null;
  handleCourtSelection: (court: ICourt) => void;
  timeSlotData: ISlot[];
  setStartSlot: Dispatch<SetStateAction<null>>;
  startSlot: string | null;
  endSlot: string | null;
  selectedSlots: string[] | null;
  setEndSlot: Dispatch<SetStateAction<null>>;
  setSelectedSlots?: Dispatch<SetStateAction<[]>>;
  selectDay: Date;
}
const FlexibleBooking = ({
  setSelectedSlots,
  setSelectDay,
  courts,
  selectedCourt,
  handleCourtSelection,
  timeSlotData,
  setStartSlot,
  selectedSlots,
  startSlot,
  endSlot,
  setEndSlot,
  selectDay,
}: CalendarDailyProps) => {
  console.log("selectDay", selectDay);
  const { toast } = useToast();

  // const {
  //   mutateAsync: getSlotByCourtId,

  //   data: SlotOfCourt,
  // } = useMutation({
  //   mutationFn: async (dataReq: {
  //     date: Date | undefined;
  //     courtId: string | undefined;
  //   }) => {
  //     return getSlotsOfCourt(dataReq);
  //   },
  //   onSuccess: (dataRes) => {
  //     if (!dataRes.ok) {
  //       // if (data.error) {
  //       //   const errs = data.error as { [key: string]: { message: string } };
  //       //   Object.entries(errs).forEach(([key, value]) => {
  //       //     setError(key as keyof PackageCourtSchemaType, {
  //       //       type: "manual",
  //       //       message: value.message,
  //       //     });
  //       //   });
  //       // }
  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description: dataRes.message || dataRes.statusText,
  //       });
  //       throw new Error(dataRes.message || dataRes.statusText);
  //     }
  //   },
  // });
  // console.log(SlotOfCourt);
  // useEffect(() => {
  //   if (selectedCourt?._id !== "" && selectedCourt) {
  //     console.log({
  //       courtId: selectedCourt?._id,
  //       date: format(selectDay?.toString(), "yyyy-MM-dd"),
  //     });
  //     getSlotByCourtId({
  //       courtId: selectedCourt?._id,
  //       date: format(selectDay?.toString(), "yyyy-MM-dd"),
  //     });
  //   }
  // }, [getSlotByCourtId, selectDay, selectedCourt]);
  return (
    <div>
      <CalendarDaily
        setSelectedSlots={setSelectedSlots}
        setDay={setSelectDay}
        setEndSlot={setEndSlot}
        setStartSlot={setStartSlot}
      />

      {selectDay && (
        <div className="mx-auto mt-6 max-w-2xl">
          <h3 className="mb-2 text-lg font-bold">Select Badminton Court</h3>
          <div className="grid grid-cols-2 gap-4">
            {courts?.map((value: ICourt) => (
              <Card
                key={value._id}
                className={`cursor-pointer ${
                  selectedCourt !== null && selectedCourt._id === value._id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleCourtSelection(value)}
              >
                <CardContent className="grid gap-4 overflow-hidden p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`cursor-pointer rounded-lg object-cover p-2 ${
                        selectedCourt !== null &&
                        selectedCourt._id === value._id
                          ? " bg-slate-500 stroke-white "
                          : " border-white text-white "
                      }`}
                    >
                      <Icons.BadmintonCourt className="rounded-lg object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{value.name}</h3>
                      <span
                        className={`line-clamp-3 text-sm ${
                          selectedCourt !== null &&
                          selectedCourt._id === value._id
                            ? " text-slate-300 dark:text-slate-200 "
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {value.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CustomTag status={value.status} />
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        selectedCourt !== null &&
                        selectedCourt._id === value._id
                          ? " text-slate-300 dark:text-slate-200 "
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <UsersIcon className="size-4" />
                      <span>type: {value.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        selectedCourt !== null &&
                        selectedCourt._id === value._id
                          ? " text-slate-300 dark:text-slate-200 "
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {/* <DollarSignIcon className="size-4" /> */}
                      <span>
                        {(value.price / 100).toFixed(2)}
                        VND/slot
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleBooking;
