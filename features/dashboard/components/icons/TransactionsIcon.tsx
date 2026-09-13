interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function TransactionsIcon({ color = "currentColor", size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Up arrow (send) */}
      <path
        d="M7 16V4M7 4L4 7M7 4l3 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Down arrow (receive) */}
      <path
        d="M17 8v12m0 0l-3-3m3 3l3-3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
