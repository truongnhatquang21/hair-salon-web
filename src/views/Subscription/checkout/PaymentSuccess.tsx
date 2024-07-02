/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FlJtkO7jKt3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { format } from "date-fns";
import Link from "next/link";

import type { PurchasedOrderType } from "@/apiCallers/package";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
type Props = {
  purchaseData: PurchasedOrderType;
};
export default function PaymentSuccesss({ purchaseData }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center  ">
      <Card className="w-full max-w-md space-y-6 rounded-lg border-0 bg-transparent p-6  shadow-none dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="size-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-50">
            Payment Successful
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Thank you for your payment. Your order is being processed.
          </p>
          <span className="mt-2 text-gray-500 dark:text-gray-400">
            Order ID: {purchaseData?._id}
          </span>
        </div>
        <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Amount Paid:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              ${purchaseData?.totalPrice}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Payment Method:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              Credit Card
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Date &amp; Time:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {format(new Date(purchaseData?.createdAt || new Date()), "PPpp")}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Link href="/">
            <Button className="mt-6 w-full">Go to home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
