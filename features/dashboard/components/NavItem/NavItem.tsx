import { ReactNode } from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function NavItem({
  href,
  icon,
  text,
  active = false,
  collapsed = false,
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? text : undefined}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ${
        collapsed ? 'justify-center' : 'justify-start'
      } ${
        active
          ? 'bg-brand-lightest text-brand-main'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap text-sm font-medium">{text}</span>
      )}
    </Link>
  );
}
