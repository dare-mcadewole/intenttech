import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Native-select fallback in shadcn styling. The full shadcn Select is
 * Radix-based; for this scaffold we keep a styled native <select> so there
 * is no extra runtime dependency. Swap for @radix-ui/react-select later
 * if custom dropdown UX is needed.
 */
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-white/80 px-4 py-2 text-sm shadow-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

export { Select };
