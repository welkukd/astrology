'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'gold' | 'subtle';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: cn(
    'bg-accent-gold-muted text-accent-gold border border-accent-gold-border',
    'font-semibold uppercase tracking-[0.02em]',
  ),
  subtle: cn(
    'bg-bg-hover text-text-muted',
    'font-medium',
  ),
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'gold', children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs rounded-pill',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';