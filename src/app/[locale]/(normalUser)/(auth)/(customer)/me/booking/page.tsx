import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "postcss";
import React from "react";
import { Button } from "react-day-picker";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Confirm Booking</h1>
          <p className="text-muted-foreground">
            Review your badminton court booking details.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-type">Payment Type</Label>
                <Select id="payment-type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select id="payment-method">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total-price">Total Price</Label>
                <div id="total-price">$50.00</div>
              </div>
              <div>
                <Label htmlFor="total-hours">Total Hours</Label>
                <div id="total-hours">2 hours</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="text"
                  value="June 30, 2024"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="text"
                  value="June 30, 2024"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input id="start-time" type="text" value="6:00 PM" disabled />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input id="end-time" type="text" value="8:00 PM" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="court">Court</Label>
                <Input id="court" type="text" value="Court 3" disabled />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Confirm Booking</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default page;
