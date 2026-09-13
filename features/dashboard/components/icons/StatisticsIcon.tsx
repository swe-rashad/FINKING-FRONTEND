interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function StatisticsIcon({ color = "currentColor", size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bar chart */}
      <rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
