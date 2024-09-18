/* eslint-disable react/jsx-pascal-case */

'use client';

import { Clock, DollarSignIcon, MapPin, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';

import type { IBranch } from '@/interfaces/branch.interface';
import type { ICourt } from '@/interfaces/court.interface';
import { CourtStatusEnum } from '@/types';

import { EmptyComponent } from '../Empty';
import { Icons } from '../icons';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Separator } from '../ui/separator';

interface BranchDetailOverviewProps {
  data: {
    data: IBranch;
    courts: ICourt;
  };
}

const BranchDetailOverview: FC<BranchDetailOverviewProps> = ({ data }) => {
  return (
    <div className=''>
      <div className='grid grid-cols-1 gap-4  md:grid-cols-4'>
        <div className='col-span-full md:col-span-3'>
          <Card className=''>
            <CardHeader>
              <CardTitle>{data?.data?.name}</CardTitle>
              <CardDescription>
                <div className='flex flex-col'>
                  <div className='flex gap-4'>
                    <div className=''> 1200 Booked</div>
                    <div className=' flex items-center justify-center gap-2'>
                      <Clock />
                      <span>{data?.data.availableTime}</span>
                    </div>
                    <div className=' flex items-center justify-center gap-2'>
                      <Icons.badmintonCourt />{' '}
                      <span>{data?.data.courts.length} court</span>
                    </div>
                  </div>
                  <div className='flex'>
                    <MapPin className='text-blue-500' />
                    <span>{data?.data.address}</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-semibold leading-none tracking-tight'>
                Description
              </div>
              <div className='p-4'>{data?.data.description}</div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <div className='grid grid-cols-2 gap-8'>
                <div className='space-y-4'>
                  <ul className='space-y-2'>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary '>
                        <Icons.swimming_pool />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>Secure Payments</h4>
                        <span className='text-muted-foreground'>
                          All transactions are encrypted and secure.
                        </span>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary '>
                        <Icons.service_icon />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>Fast Delivery</h4>
                        <span className='text-muted-foreground'>
                          Your order will be delivered quickly and efficiently.
                        </span>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 '>
                        <Icons.top_rate />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>
                          Excellent Support
                        </h4>
                        <span className='text-muted-foreground'>
                          Our team is available 24/7 to assist you.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='space-y-4'>
                  <ul className='space-y-2'>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary '>
                        <Icons.free_wifi />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>Easy Returns</h4>
                        <span className='text-muted-foreground'>
                          If you are not satisfied, we offer a hassle-free
                          return policy.
                        </span>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary '>
                        <Icons.air_condition />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>
                          Lifetime Warranty
                        </h4>
                        <span className='text-muted-foreground'>
                          Our products come with a lifetime warranty for your
                          peace of mind.
                        </span>
                      </div>
                    </li>
                    <li className='flex items-start'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary '>
                        <Icons.car_parking />
                      </div>
                      <div className='ml-3'>
                        <h4 className='text-lg font-medium'>Eco-Friendly</h4>
                        <span className='text-muted-foreground'>
                          Our products are made with sustainable materials.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='col-span-full md:col-span-1'>
          <Card className='size-full max-w-4xl'>
            <CardContent className='aspect-[16/9] p-0 '>
              <div className='size-full overflow-hidden rounded-t-lg'>
                <iframe
                  title='address'
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.655651039589!2d106.82929907591375!3d10.837642358059826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175218a84a88243%3A0xe6bd24c6a8e9507c!2sVinHomes%20Qu%E1%BA%ADn%209!5e0!3m2!1svi!2s!4v1717722465479!5m2!1svi!2s'
                  // width={800}
                  className='w-full '
                  height={600}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
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
      <Separator className='my-4' />
      <div className='grid gap-8'>
        <div className='grid gap-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Our Court </h2>
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
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {data.data.courts.filter(
              (el) => el.status === CourtStatusEnum.INUSE
            ).length === 0 ? (
              <EmptyComponent
                title='There is no available court in this branch'
                description='Please choose another branch'
                className='col-span-3  w-full'
              />
            ) : (
              data.data.courts.map((court: ICourt) => {
                if (court.status === CourtStatusEnum.INUSE) {
                  return (
                    <Link key={court?._id} href={`/court-detail/${court?._id}`}>
                      <Card>
                        <CardContent className='grid gap-4 overflow-hidden p-5'>
                          <div className='flex items-center gap-4'>
                            <Icons.badmintonCourt className='rounded-lg object-cover' />
                            {/* <Image src={} alt="Court Image" width={80} height={80} /> */}
                            <div className='w-full'>
                              <h3 className='font-semibold'>{court.name}</h3>
                              <span className='line-clamp-3  text-sm  text-gray-500 dark:text-gray-400'>
                                {court.description}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                              <Badge
                                variant='solid'
                                className='bg-yellow-500 text-white'
                              >
                                {court.status}
                              </Badge>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                              <UsersIcon className='size-4' />
                              <span>type: {court.type}</span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                              <DollarSignIcon className='size-4' />
                              <span>{court.price}/hr</span>
                            </div>
                            {/* <Button variant="outline" size="sm">
                          Book Now
                        </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailOverview;
