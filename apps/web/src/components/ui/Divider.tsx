'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type DividerVariant = 'subtle' | 'standard' | 'gold';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  variant?: DividerVariant;
  className?: string;
}

const variantClasses: Record<DividerVariant, string> = {
  subtle: 'border-border-subtle',
  standard: 'border-border-standard',
  gold: 'border-accent-gold opacity-30 w-[60px] mx-auto',
};

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ variant = 'subtle', className, ...props }, ref) => (
    <hr
      ref={ref}
      role="separator"
      className={cn(
        'border-t',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

Divider.displayName = 'Divider';