interface SidebarToggleIconProps {
  collapsed?: boolean;
  size?: number;
  color?: string;
  className?: string;
}

export default function SidebarToggleIcon({
  collapsed = false,
  size = 20,
  color = 'currentColor',
  className,
}: SidebarToggleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M9 3v18" stroke={color} strokeWidth="1.5" />
      {collapsed ? (
        <path
          d="m13.5 9 3 3-3 3"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="m16.5 9-3 3 3 3"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
