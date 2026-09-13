interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function UsersIcon({ color = "currentColor", size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Primary user */}
      <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.5" />
      <path
        d="M2 20c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Secondary user */}
      <circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="1.5" />
      <path
        d="M22 20c0-2.761-2.239-5-5-5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
