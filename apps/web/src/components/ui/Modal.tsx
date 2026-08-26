'use client';

import { forwardRef, HTMLAttributes, useEffect, useRef, ReactNode, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface ModalTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

interface ModalDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface ModalCloseProps extends HTMLAttributes<HTMLButtonElement> {}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-[360px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  full: 'max-w-[90vw] w-[90vw]',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
      ...props
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
    const descriptionId = `modal-description-${Math.random().toString(36).slice(2, 9)}`;

    // Focus management
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        // Focus the modal content or first focusable element
        setTimeout(() => {
          contentRef.current?.focus();
        }, 0);
      } else {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    // Escape key handling
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEscape, onClose]);

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === overlayRef.current) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return createPortal(
      <Fragment>
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-overlay-modal backdrop-blur-modal z-[400] animate-fade-in"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            'fixed inset-0 z-[500] flex items-center justify-center p-4',
            'animate-scale-in'
          )}
        >
          <div
            ref={ref}
            className={cn(
              'relative w-full',
              'bg-bg-elevated border border-border-standard rounded-xxl',
              'shadow-modal',
              'overflow-hidden',
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {(title || description) && (
              <div className="flex items-start justify-between p-6 border-b border-border-subtle">
                <div>
                  {title && (
                    <h2
                      id={titleId}
                      className="text-heading-3 font-display font-medium text-text-primary"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-2 text-body-sm text-text-muted"
                    >
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full',
                    'bg-transparent border border-border-subtle text-text-muted',
                    'hover:bg-bg-hover hover:text-text-primary hover:border-border-standard',
                    'transition-all duration-micro ease-out-expo',
                    'focus-visible:outline-none focus-visible:shadow-focus',
                    'touch-target'
                  )}
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </Fragment>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

/**
 * Modal sub-components for compound component pattern
 */
export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  )
);

ModalTrigger.displayName = 'ModalTrigger';

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
);

ModalContent.displayName = 'ModalContent';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-heading-3 font-display font-medium text-text-primary', className)}
      {...props}
    >
      {children}
    </h2>
  )
);

ModalTitle.displayName = 'ModalTitle';

export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('mt-2 text-body-sm text-text-muted', className)}
      {...props}
    >
      {children}
    </p>
  )
);

ModalDescription.displayName = 'ModalDescription';

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
);

ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 flex items-center justify-end gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

export const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'p-2 rounded-full',
        'bg-transparent border border-border-subtle text-text-muted',
        'hover:bg-bg-hover hover:text-text-primary hover:border-border-standard',
        'transition-all duration-micro ease-out-expo',
        'focus-visible:outline-none focus-visible:shadow-focus',
        'touch-target',
        className
      )}
      {...props}
    >
      {children || <X className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
);

ModalClose.displayName = 'ModalClose';