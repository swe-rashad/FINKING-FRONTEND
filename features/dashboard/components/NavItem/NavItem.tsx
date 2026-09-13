import { ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function NavItem({ icon, text, active = false, collapsed = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? text : undefined}
      style={{
        color: active ? 'var(--color-brand-main)' : 'inherit',
        backgroundColor: active ? 'var(--color-brand-lightest)' : 'transparent',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-100"
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{text}</span>}
    </button>
  );
}
