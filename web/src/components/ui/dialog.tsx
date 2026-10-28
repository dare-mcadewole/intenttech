'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => onOpenChange(false)}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('w-full max-w-lg rounded-lg bg-background p-6 shadow-lg', className)}>{children}</div>;
}
export function DialogHeader({ children }: { children: React.ReactNode }) { return <div className="mb-4">{children}</div>; }
export function DialogTitle({ children }: { children: React.ReactNode }) { return <h2 className="text-lg font-semibold">{children}</h2>; }
export function DialogFooter({ children }: { children: React.ReactNode }) { return <div className="mt-8 flex justify-end gap-2">{children}</div>; }
