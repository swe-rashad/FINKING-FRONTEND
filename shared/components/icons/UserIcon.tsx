interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function UserIcon({ color = 'currentColor', size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <path
        d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
