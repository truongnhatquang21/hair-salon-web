'use client';

// eslint-disable-next-line
import { Copy } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function Layout(props: { children: React.ReactNode }) {
  const t = useTranslations('RootLayout');

  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link
              href="/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('home_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/about/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('about_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/portfolio/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('portfolio_link')}
            </Link>

            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Share</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">test</div>
                    <Button type="submit" size="sm" className="px-3">
                      <span className="sr-only">Copy</span>
                      <Copy className="size-4" />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          </li>
        </>
      }
      rightNav={
        <>
          <li>
            <Link
              href="/sign-in/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('sign_in_link')}
            </Link>
          </li>

          <li>
            <Link
              href="/sign-up/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('sign_up_link')}
            </Link>
          </li>

          <li>
            <LocaleSwitcher />
          </li>
        </>
      }
    >
      <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
    </BaseTemplate>
  );
}
