'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'default' | 'sm' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeClasses: Record<InputSize, string> = {
  default: 'px-4 py-3.5 text-base min-h-[44px]',
  sm: 'px-3 py-2.5 text-sm min-h-[40px]',
  lg: 'px-4 py-4 text-lg min-h-[48px]',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'default',
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;
    const describedBy = [
      helperText && `${inputId}-helper`,
      error && `${inputId}-error`,
      ariaDescribedBy,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="label-base block mb-1"
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(
              'w-full font-body rounded-md',
              'bg-bg-panel text-text-primary placeholder:text-text-subtle',
              'border transition-all duration-standard ease-out-expo',
              'border-border-subtle',
              'focus:outline-none focus:border-accent-gold focus:shadow-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError && 'border-danger focus:border-danger focus:shadow-focus-error',
              sizeClasses[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="caption text-danger mt-1.5"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="caption text-text-subtle mt-1.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea component with consistent styling
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'default',
      className,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;
    const describedBy = [
      helperText && `${textareaId}-helper`,
      error && `${textareaId}-error`,
      ariaDescribedBy,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="label-base block mb-1"
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={cn(
            'w-full font-body rounded-md resize-y min-h-[100px]',
            'bg-bg-panel text-text-primary placeholder:text-text-subtle',
            'border transition-all duration-standard ease-out-expo',
            'border-border-subtle',
            'focus:outline-none focus:border-accent-gold focus:shadow-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError && 'border-danger focus:border-danger focus:shadow-focus-error',
            sizeClasses[size],
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="caption text-danger mt-1.5"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="caption text-text-subtle mt-1.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select component with consistent styling
 */
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'default',
      options,
      placeholder,
      className,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;
    const describedBy = [
      helperText && `${selectId}-helper`,
      error && `${selectId}-error`,
      ariaDescribedBy,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="label-base block mb-1"
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(
                          'w-full font-body rounded-md appearance-none',
                          'bg-bg-panel text-text-primary',
                          'border transition-all duration-standard ease-out-expo',
                          'border-border-subtle',
                          'focus:outline-none focus:border-accent-gold focus:shadow-focus',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          hasError && 'border-danger focus:border-danger focus:shadow-focus-error',
                          sizeClasses[size],
                          'select-chevron pr-11',
                          className
                        )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="caption text-danger mt-1.5"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="caption text-text-subtle mt-1.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Input, Textarea, Select };