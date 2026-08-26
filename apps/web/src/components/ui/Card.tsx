'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'hover' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  padding?: 'none' | 'default' | 'lg' | 'xl';
}

const variantClasses: Record<CardVariant, string> = {
  default: cn(
    'bg-bg-card border border-border-subtle rounded-lg',
    'shadow-card',
    'transition-all duration-card-hover ease-out-expo',
  ),
  hover: cn(
    'bg-bg-card border border-border-subtle rounded-lg',
    'shadow-card',
    'hover:border-border-standard hover:shadow-card-hover',
    'transition-all duration-card-hover ease-out-expo',
  ),
  elevated: cn(
    'bg-bg-elevated border border-border-standard rounded-xl',
    'shadow-elevated',
  ),
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  default: 'p-8',      // 32px (spacing.xl)
  lg: 'p-10',          // 40px
  xl: 'p-12',          // 48px (spacing.xxl)
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader - for consistent header styling within cards
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-6', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - consistent title styling
 */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-heading-3 font-display font-medium text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - consistent description styling
 */
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-body-sm text-text-muted mt-2',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent - main content area
 */
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter - consistent footer styling
 */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';