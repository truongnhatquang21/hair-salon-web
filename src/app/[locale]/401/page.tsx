/**
 * v0 by Vercel.
 * @see https://v0.dev/t/rZlhMRPnYVa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from 'next/link';

export default function Component() {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center'>
        <div className='mx-auto size-12 text-primary' />
        <h1 className='mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
          Oops, you've stumbled upon a 401 error!
        </h1>
        <p className='mt-4 text-muted-foreground'>
          It looks like you don't have permission to access this page on the
          badminton platform. Please check with the platform administrators if
          you believe this is an error.
        </p>
        <div className='mt-6'>
          <Link
            href='/sign-in'
            className='inline-flex items-center rounded-md bg-primary px-10 px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            prefetch={false}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
