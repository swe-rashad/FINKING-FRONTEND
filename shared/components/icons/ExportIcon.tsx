interface IconProps {
  size?: number;
  className?: string;
}

export default function ExportIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arrow pointing up-right out of box */}
      <path
        d="M12 3v10M12 3l-3.5 3.5M12 3l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
