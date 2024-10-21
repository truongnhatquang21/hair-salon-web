'use client';

import Link from 'next/link';

import { Menu } from '@/components/admin-panel/menu';
import { SidebarToggle } from '@/components/admin-panel/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex-1'>{children};</div>;
};
export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        'fixed border-r-2 flex flex-col shadow-md top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className='relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800'>
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant='link'
          asChild
        >
          <Link
            href='/'
            className='flex items-center gap-1 text-2xl font-bold hover:no-underline'
          >
            <h1
              className='
            font-sans text-3xl font-bold text-primary'
            >
              HAIR SALON
            </h1>
          </Link>
        </Button>

        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
