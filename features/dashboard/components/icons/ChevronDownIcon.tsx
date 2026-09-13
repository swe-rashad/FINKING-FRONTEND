import { CSSProperties } from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ChevronDownIcon({ color = 'currentColor', size = 24, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <polyline
        points="6 9 12 15 18 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
