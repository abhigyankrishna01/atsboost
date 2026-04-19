import { cn } from "./cn";

interface Props {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const SIZES = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function Spinner({ size = "sm", label = "Loading", className }: Props) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        className={cn("animate-spin", SIZES[size], className)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
