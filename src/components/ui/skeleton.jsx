import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <span
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props} />
  );
}

export { Skeleton }
