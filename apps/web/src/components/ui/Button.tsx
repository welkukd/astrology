'use client';

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

interface AnchorButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'disabled' | 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-7 py-3.5 text-base min-h-[44px]',
  sm: 'px-5 py-2.5 text-sm min-h-[40px]',
  lg: 'px-8 py-4 text-lg min-h-[48px]',
  icon: 'p-3.5 min-h-[44px] min-w-[44px]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-accent-gold text-bg-primary font-semibold',
    'hover:bg-accent-gold-hover active:bg-[rgb(230,167,0)]',
    'hover:shadow-gold-glow active:shadow-none',
    'hover:-translate-y-[1px] active:translate-y-0',
    'transition-all duration-standard ease-out-expo',
    'focus-visible:shadow-focus',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0',
  ),
  secondary: cn(
    'bg-transparent text-text-primary border border-border-standard font-medium',
    'hover:bg-bg-hover hover:border-accent-gold hover:text-accent-gold',
    'transition-all duration-standard ease-out-expo',
    'focus-visible:shadow-focus',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border-standard disabled:hover:text-text-primary',
  ),
  ghost: cn(
    'bg-transparent text-text-secondary font-normal',
    'hover:bg-bg-hover hover:text-text-primary',
    'transition-all duration-standard ease-out-expo',
    'focus-visible:shadow-focus',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary',
  ),
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-body rounded-md',
          'touch-target',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Polymorphic button that renders as <a> when href is provided
 */
export const AnchorButton = forwardRef<HTMLAnchorElement, AnchorButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      href,
      ...props
    },
    ref
  ) => {
    const isDisabled = isLoading;

    if (isDisabled) {
      // Render as button when disabled to prevent navigation
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={true}
          aria-busy={isLoading}
          aria-disabled={true}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'font-body rounded-md',
            'touch-target',
            variantClasses[variant],
            sizeClasses[size],
            fullWidth && 'w-full',
            className
          )}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : leftIcon ? (
            <span aria-hidden="true">{leftIcon}</span>
          ) : null}
          {children}
          {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </button>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-body rounded-md',
          'touch-target',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </a>
    );
  }
);

AnchorButton.displayName = 'AnchorButton';

export { Button };