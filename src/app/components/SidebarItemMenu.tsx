'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarItemMenuProps {
  href: string;
  icon: ReactNode;
  title: string;
  badge?: string | number;
  isCollapsed?: boolean;
}

export function SidebarItemMenu({ 
  href, 
  icon, 
  title, 
  badge, 
  isCollapsed = false 
}: SidebarItemMenuProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
          : 'text-black-700 hover:bg-black-100 hover:text-black-900'
        }
        ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
      `}
    >
      <span className="flex-shrink-0 w-5 h-5">
        {icon}
      </span>
      
      {!isCollapsed && (
        <>
          <span className="ml-3 truncate">{title}</span>
          {badge && (
            <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}