import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label ? <label htmlFor={htmlFor} className="text-sm font-medium leading-none inline-block mb-2">{label}</label> : null}
      {children}
      {hint && !error ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
