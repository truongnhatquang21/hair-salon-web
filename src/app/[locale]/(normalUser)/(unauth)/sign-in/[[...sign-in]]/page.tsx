import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { UserAuthForm } from '@/components/AuthForm';
import banner from '@/public/assets/images/banner.jpg';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function AuthenticationPage() {
  return (
    <div className='container relative grid h-full  min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col rounded-md  p-4   font-bold text-white dark:border-r lg:flex'>
        <div className='absolute inset-0  flex size-full items-center justify-center rounded-md '>
          <Image
            className=' h-full object-contain '
            alt='badminton banner'
            src={banner}
          />
        </div>
        {/* <div className="relative z-20 flex items-center text-lg font-medium">
          <Image src={logo} alt="badminton" width={40} />
          badminton
        </div> */}
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign in</h1>
            <span className='text-sm text-muted-foreground'>
              Complete our form below to sign in your account
            </span>
          </div>
          <UserAuthForm type='sign-in' />
          <span className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </span>
        </div>
      </div>
    </div>
  );
}
