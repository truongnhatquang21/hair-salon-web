/* eslint-disable react/jsx-pascal-case */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  ClockIcon,
  DollarSignIcon,
  MapPin,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getBranchByIdAPI } from "@/apiCallers/Branches";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
// interface BranchDetailOverviewProps {}
import { useToast } from "../ui/use-toast";

const BranchDetailOverview = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brachDetail"],
    queryFn: async () => getBranchByIdAPI(slug),
  });
  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError || !data?.data) {
    router.push("/");
    // toast({
    //   variant: "destructive",
    //   title: "Uh oh! Something went wrong.",
    //   description: data.message || data.statusText,
    // });
    return <div>Uh oh! Something went wrong.</div>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4  md:grid-cols-4">
        <div className="col-span-full md:col-span-3">
          <Card className="">
            <CardHeader>
              <CardTitle>{data?.data.name}</CardTitle>
              <CardDescription>
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <div className=""> 1200 Booked</div>
                    <div className=" flex items-center justify-center gap-2">
                      <Clock />
                      <span>{data?.data.availableTime}</span>
                    </div>
                    <div className=" flex items-center justify-center gap-2">
                      <Icons.badminton_court />{" "}
                      <span>{data?.data.courts.length} court</span>
                    </div>
                  </div>
                  <div className="flex">
                    <MapPin className="text-blue-500" />
                    <span>{data?.data.address}</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold leading-none tracking-tight">
                Description
              </div>
              <div className="p-4">{data?.data.description}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ">
                        <Icons.swimming_pool />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">Secure Payments</h4>
                        <p className="text-muted-foreground">
                          All transactions are encrypted and secure.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ">
                        <Icons.service_icon />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">Fast Delivery</h4>
                        <p className="text-muted-foreground">
                          Your order will be delivered quickly and efficiently.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 ">
                        <Icons.top_rate />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">
                          Excellent Support
                        </h4>
                        <p className="text-muted-foreground">
                          Our team is available 24/7 to assist you.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ">
                        <Icons.free_wifi />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">Easy Returns</h4>
                        <p className="text-muted-foreground">
                          If you are not satisfied, we offer a hassle-free
                          return policy.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ">
                        <Icons.air_condition />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">
                          Lifetime Warranty
                        </h4>
                        <p className="text-muted-foreground">
                          Our products come with a lifetime warranty for your
                          peace of mind.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ">
                        <Icons.car_parking />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium">Eco-Friendly</h4>
                        <p className="text-muted-foreground">
                          Our products are made with sustainable materials.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-full md:col-span-1">
          <Card className="size-full max-w-4xl">
            <CardContent className="aspect-[16/9] p-0 ">
              <div className="size-full overflow-hidden rounded-t-lg">
                <iframe
                  title="address"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.655651039589!2d106.82929907591375!3d10.837642358059826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175218a84a88243%3A0xe6bd24c6a8e9507c!2sVinHomes%20Qu%E1%BA%ADn%209!5e0!3m2!1svi!2s!4v1717722465479!5m2!1svi!2s"
                  // width={800}
                  className="w-full "
                  height={600}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>Others Address</CardTitle>
              <CardDescription>
                View the location of our office on the map.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-8">
        {/* <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find Your Perfect Court
          </h1>
          <p className="mx-auto max-w-md text-gray-500 dark:text-gray-400">
            Search for available courts based on your location, date, time, and
            number of players.
          </p>
        </div>
        <div className="grid gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950 md:p-8">
          <form className="grid grid-cols-1 items-end gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter your address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDaysIcon className="mr-1 size-4 -translate-x-1" />
                    Pick a date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <ClockIcon className="mr-1 size-4 -translate-x-1" />
                    Pick a time
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="players">Players</Label>
              <Select>
                <SelectTrigger id="players" className="w-full">
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 player</SelectItem>
                  <SelectItem value="2">2 players</SelectItem>
                  <SelectItem value="3">3 players</SelectItem>
                  <SelectItem value="4">4 players</SelectItem>
                  <SelectItem value="5">5 players</SelectItem>
                  <SelectItem value="6">6 players</SelectItem>
                  <SelectItem value="7">7 players</SelectItem>
                  <SelectItem value="8">8 players</SelectItem>
                  <SelectItem value="9">9 players</SelectItem>
                  <SelectItem value="10">10 players</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <Button type="submit" className="w-full">
                Find Courts
              </Button>
            </div>
          </form>
        </div> */}
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Our Court </h2>
            {/* <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span>Showing 1-10 of 50</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FilterIcon className="size-5" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value="relevance">
                    <DropdownMenuRadioItem value="relevance">
                      Relevance
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-asc">
                      Price: Low to High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-desc">
                      Price: High to Low
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rating">
                      Rating
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardContent className="grid gap-4 overflow-hidden p-5">
                <div className="flex items-center gap-4">
                  <Icons.badminton_court className="rounded-lg object-cover" />
                  {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                  <div>
                    <h3 className="font-semibold">Central Park Court</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New York, NY
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="size-4" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="size-4" />
                    <span>2-6 players</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <DollarSignIcon className="size-4" />
                    <span>50/hr</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailOverview;
