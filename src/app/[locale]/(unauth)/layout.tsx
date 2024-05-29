'use client';

// eslint-disable-next-line

import { useTranslations } from 'next-intl';
export default function Layout(props: { children: React.ReactNode }) {
  const t = useTranslations('RootLayout');

  return (
 <div >
  {props.children}
 </div>)
}
