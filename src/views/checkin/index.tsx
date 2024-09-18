'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useZxing } from 'react-zxing';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function QrCodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='5' height='5' x='3' y='3' rx='1' />
      <rect width='5' height='5' x='16' y='3' rx='1' />
      <rect width='5' height='5' x='3' y='16' rx='1' />
      <path d='M21 16h-3a2 2 0 0 0-2 2v3' />
      <path d='M21 21v.01' />
      <path d='M12 7v3a2 2 0 0 1-2 2H7' />
      <path d='M3 12h.01' />
      <path d='M12 3h.01' />
      <path d='M12 16v.01' />
      <path d='M16 12h1' />
      <path d='M21 12v.01' />
      <path d='M12 21v-1' />
    </svg>
  );
}
const CheckInPage = () => {
  const [result, setResult] = useState('');
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(res) {
      setResult(new URL(res.toString()).pathname.split('/').pop());
    },
  });
  useEffect(() => {
    if (result) {
      router.push(`/dashboard/check-in/${result}`);
    }
  }, [router, result]);
  return (
    <div className='mx-auto h-full'>
      <div className='flex h-full flex-col items-center gap-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>badminton Court Check-In</h1>
          <p className='text-muted-foreground'>
            Scan QR codes to check in and view court availability.
          </p>
        </div>
        <Card className='w-full flex-1 p-2'>
          <CardContent className='flex h-full flex-col items-center gap-6'>
            <div className='flex h-full flex-col items-center gap-2'>
              <QrCodeIcon className='size-16' />
              <p className='text-muted-foreground'>
                Hold your camera up to the QR code on your receipt to check in.
              </p>
              <video ref={ref} className='size-80 rounded-md' />
              <p>
                <span>{result}</span>
              </p>
            </div>
            <div className='w-full max-w-[300px]'>
              <Input
                type='text'
                placeholder='Scan QR Code'
                className='pl-12'
                readOnly
                value={result}
              />
              {result && (
                <Button
                  onClick={() => router.push(`/dashboard/check-in/${result}`)}
                >
                  Go to Check In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {/* <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Court Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl font-bold">2</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl font-bold">1</div>
                  <div className="text-muted-foreground">Booked</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>Court 1</div>
                  <Badge variant="secondary">Booked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>Court 2</div>
                  <Badge>Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>Court 3</div>
                  <Badge>Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default CheckInPage;
