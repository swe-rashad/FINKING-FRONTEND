interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function SidebarArrowIcon({
  size = 20,
  color = 'white',
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19 12H5M5 12l6-6M5 12l6 6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
