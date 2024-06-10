/* eslint-disable react/jsx-pascal-case */
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  return (
    <div className="min-h-[calc(100vh_-_56px)] p-5">
      <div className=" rounded-xl bg-slate-400 p-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex align-middle">
            <Image
              src="/assets/images/clerk.png"
              alt="Main Image"
              width={100}
              height={100}
              className="h-auto w-full cursor-pointer object-contain p-3"
            />
          </div>
          <div className="flex flex-col space-y-2 ">
            <Image
              src="/assets/images/banner.jpeg"
              alt="Secondary Image"
              width={100}
              height={100}
              className="max-h-96 w-full cursor-pointer"
            />
            <div className="relative">
              <Image
                src="/assets/images/clerk.png"
                alt="Tertiary Image"
                className=" w-full p-3 "
                width={100}
                height={100}
              />
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-50">
                <span className="text-2xl text-white">+ 6 ...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList className="flex border-b border-gray-200 dark:border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="py-4">
            <div className="grid grid-cols-1 gap-4  md:grid-cols-4">
              <div className="col-span-full md:col-span-3">
                <Card className="">
                  <CardHeader>
                    <CardTitle>SÂN CẦU LÔNG NGUYỄN XÍ</CardTitle>
                    <CardDescription>
                      <div className="flex flex-col">
                        <div className="flex gap-4">
                          <div className=""> 1200 Booked</div>
                          <div className=" flex items-center justify-center gap-2">
                            <Clock />
                            <span>6:00 - 12:00</span>
                          </div>
                          <div className=" flex items-center justify-center gap-2">
                            <Icons.badminton_court /> <span>6 fields</span>
                          </div>
                        </div>
                        <div className="flex">
                          <MapPin className="text-blue-500" />
                          <span>
                            Lorem ipsum road, Tantruim-2322, Melbourne,
                            Australia
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold leading-none tracking-tight">
                      Description
                    </div>
                    <div className="p-4">
                      Featuring free WiFi throughout the property, Lakeside
                      Motel Waterfront offers accommodations in Lakes Entrance,
                      19 mi from Bairnsdale. Free private parking is available
                      on site. Each room at this motel is air conditioned and
                      comes with a flat-screen TV. You will find a kettle,
                      toaster and a microwave in the room. Each room is fitted
                      with a private bathroom. Guests have access to barbecue
                      facilities and a lovely large lawn area. Metung is 6.8 mi
                      from Lakeside Motel Waterfront, while Paynesville is 14 mi
                      from the property. Couples in particular like the location
                      – they rated it 9.2 for a two-person trip.
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-lg font-medium">
                                Secure Payments
                              </h4>
                              <p className="text-muted-foreground">
                                All transactions are encrypted and secure.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-lg font-medium">
                                Fast Delivery
                              </h4>
                              <p className="text-muted-foreground">
                                Your order will be delivered quickly and
                                efficiently.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
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
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-lg font-medium">
                                Easy Returns
                              </h4>
                              <p className="text-muted-foreground">
                                If you are not satisfied, we offer a hassle-free
                                return policy.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-lg font-medium">
                                Lifetime Warranty
                              </h4>
                              <p className="text-muted-foreground">
                                Our products come with a lifetime warranty for
                                your peace of mind.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="size-6 shrink-0 rounded-full bg-primary/10 text-primary">
                              <Icons.yes_icon />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-lg font-medium">
                                Eco-Friendly
                              </h4>
                              <p className="text-muted-foreground">
                                Our products are made with sustainable
                                materials.
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
          </TabsContent>
          <TabsContent value="schedules" className="py-4">
            <p>This is the details tab content.</p>
          </TabsContent>
          <TabsContent value="map" className="py-4">
            <p>This is the reviews tab content.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
