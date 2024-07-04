/* eslint-disable no-underscore-dangle */

"use client";

import { useMutation } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { postBooking } from "@/apiCallers/customerBooking";
import CustomTag from "@/components/CustomTag";
import { Icons } from "@/components/icons";
import SpinnerIcon from "@/components/SpinnerIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { IBooking } from "@/interfaces/booking.interface";
import type { ISchedule } from "@/interfaces/schedule.interface";
import { useBookingStore } from "@/stores/bookingStore";

// type Props = {
//   branchId: String;
// };

const ConfirmBooking = () => {
  const [paymentType, setPaymentType] = useState("credit-card");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const router = useRouter();
  const { toast } = useToast();

  const { bookingData } = useBookingStore((state) => {
    return {
      bookingData: state.bookingData,
    };
  });

  const { mutateAsync: bookingMutation, isPending: bookingMutating } =
    useMutation({
      mutationFn: async (bookingReq: {
        booking: Omit<IBooking, "status">;
        schedule: Omit<ISchedule, "status">;
      }) => postBooking(bookingReq),
      onSuccess: (data) => {
        console.log(data);

        if (!data.ok) {
          if (data.error) {
            // const errs = data.error as { [key: string]: { message: string } };
            // Object.entries(errs).forEach(([key, value]) => {
            //   setError(key as keyof PackageCourtSchemaType, {
            //     type: "manual",
            //     message: value.message,
            //   });
            // });
            console.log(data.error);
          }

          return toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.message || data.statusText,
          });
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
  const handleBooking = async () => {
    if (bookingData.booking && bookingData.schedule) {
      await bookingMutation({
        booking: {
          type: bookingData.booking.type,
          paymentType,
          paymentMethod,
          totalPrice: bookingData.booking.totalPrice,
          totalHour: bookingData.booking.totalHour,
          startDate: bookingData.booking.startDate,
          endDate: bookingData.booking.endDate,
          court: bookingData.booking.court._id,
        },
        schedule: {
          type: bookingData.schedule.type,
          slots: bookingData.schedule.slots,
          startTime: bookingData.schedule?.startTime,
          endTime: bookingData.schedule?.endTime,
          date: bookingData.schedule?.date,
          court: bookingData.schedule.court._id,
        },
      });
    }
  };
  console.log(bookingData);
  useEffect(() => {
    if (!bookingData.booking) {
      router.back();
    }
  }, [bookingData.booking, router]);
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Confirm Booking</h1>
        <p className="text-lg text-muted-foreground">
          Review your badminton court booking details.
        </p>
      </div>
      <Card className="rounded-lg shadow-lg">
        <CardHeader className="rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
          <CardTitle className="text-center text-2xl font-semibold">
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start-date" className="text-lg font-medium">
                Start Date
              </Label>
              <div id="start-date" className="mt-2 text-sm font-medium">
                {bookingData.booking?.startDate}
              </div>
            </div>
            <div>
              <Label htmlFor="end-date" className="text-lg font-medium">
                End Date
              </Label>
              <div id="end-date" className="mt-2 text-sm font-medium">
                {bookingData.booking?.endDate}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start-time" className="text-lg font-medium">
                Start Time
              </Label>
              <div id="start-time" className="mt-2 text-sm font-medium">
                {bookingData.schedule?.startTime}
              </div>
            </div>
            <div>
              <Label htmlFor="end-time" className="text-lg font-medium">
                End Time
              </Label>
              <div id="start-time" className="mt-2 text-sm font-medium">
                {bookingData.schedule?.endTime}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="court" className="text-lg font-medium">
              Court
            </Label>
            <Card
              key={bookingData.booking?.court._id}
              className={`
   
                 cursor-pointer
              hover:bg-muted`}
            >
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`cursor-pointer rounded-lg border-white object-cover 
                       p-2 text-white 
                    `}
                  >
                    <Icons.BadmintonCourt className="rounded-lg object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {bookingData.booking?.court.name}
                    </h3>
                    <span
                      className={`text-sm 
                       text-gray-500 dark:text-gray-400
                  `}
                    >
                      {bookingData.booking?.court.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CustomTag status={bookingData.booking?.court.status} />
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm 
                        text-gray-500 dark:text-gray-400
                    `}
                  >
                    <UsersIcon className="size-4" />
                    <span>type: {bookingData.booking?.court.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-2 text-sm 
                    text-gray-500 dark:text-gray-400
                    `}
                  >
                    {/* <DollarSignIcon className="size-4" /> */}
                    <span>
                      {" "}
                      {(bookingData?.booking?.court.price / 100).toFixed(2)}
                      VND/slot
                    </span>
                  </div>
                  {/* <Button variant="outline" size="sm">
                        Book Now
                      </Button> */}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="total-price" className="text-lg font-medium">
                Total Price
              </Label>
              <div id="total-price" className="mt-2 text-2xl font-bold">
                {(bookingData?.booking.totalPrice / 100).toFixed(2)}
                VND
              </div>
            </div>
            <div>
              <Label htmlFor="total-hours" className="text-lg font-medium">
                Total Hours
              </Label>
              <div id="total-hours" className="mt-2 text-2xl font-bold">
                {bookingData.booking?.totalHour}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="payment-type" className="text-lg font-medium">
                Payment Type
              </Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="rounded-md border-input bg-background px-4 py-2 text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-input bg-background shadow-lg">
                  <SelectItem value="credit-card" className=" hover:bg-muted">
                    Credit Card
                  </SelectItem>
                  <SelectItem value="paypal" className=" hover:bg-muted">
                    PayPal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-method" className="text-lg font-medium">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="rounded-md border-input bg-background px-4 py-2 text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-input bg-background shadow-lg">
                  <SelectItem value="visa" className=" hover:bg-muted">
                    Visa
                  </SelectItem>
                  <SelectItem value="mastercard" className=" hover:bg-muted">
                    Mastercard
                  </SelectItem>
                  <SelectItem value="amex" className=" hover:bg-muted">
                    American Express
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="rounded-b-lg bg-primary px-6 py-4 text-primary-foreground">
          <Button
            onClick={handleBooking}
            className="w-full rounded-md bg-primary-foreground px-4 py-2 font-medium text-primary shadow-sm transition-colors hover:bg-slate-300"
          >
            {bookingMutating && <SpinnerIcon />}
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmBooking;
