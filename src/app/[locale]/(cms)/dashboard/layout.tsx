import type { Metadata } from 'next';

import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';

export const metadata: Metadata = {
  title: 'Hair Salon Management',
};
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
