'use client';

import { forwardRef, HTMLAttributes, useState, useRef, useEffect, isValidElement, cloneElement, ReactNode, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  content: ReactNode;
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayMs?: number;
  skipDelayDuration?: number;
}

interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
}

const DEFAULT_SIDE_OFFSET = 8;
const DEFAULT_DELAY = 200;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      side = 'top',
      align = 'center',
      delayMs = DEFAULT_DELAY,
      skipDelayDuration = 1000,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [arrowPosition, setArrowPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCloseTimeRef = useRef(0);

    const computePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = 0;
      let y = 0;
      let arrowX = 0;
      let arrowY = 0;

      const gap = DEFAULT_SIDE_OFFSET;

      switch (side) {
        case 'top':
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.top - tooltipRect.height - gap;
          arrowX = tooltipRect.width / 2;
          arrowY = tooltipRect.height;
          break;
        case 'bottom':
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.bottom + gap;
          arrowX = tooltipRect.width / 2;
          arrowY = 0;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - gap;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          arrowX = tooltipRect.width;
          arrowY = tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + gap;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          arrowX = 0;
          arrowY = tooltipRect.height / 2;
          break;
      }

      // Handle alignment
      switch (align) {
        case 'start':
          if (side === 'top' || side === 'bottom') {
            x = triggerRect.left;
            arrowX = triggerRect.width / 2;
          } else {
            y = triggerRect.top;
            arrowY = triggerRect.height / 2;
          }
          break;
        case 'end':
          if (side === 'top' || side === 'bottom') {
            x = triggerRect.right - tooltipRect.width;
            arrowX = tooltipRect.width - triggerRect.width / 2;
          } else {
            y = triggerRect.bottom - tooltipRect.height;
            arrowY = tooltipRect.height - triggerRect.height / 2;
          }
          break;
      }

      // Viewport collision detection
      const padding = 8;
      if (x < padding) {
        x = padding;
        if (side === 'top' || side === 'bottom') arrowX = triggerRect.left + triggerRect.width / 2 - padding;
      }
      if (x + tooltipRect.width > viewportWidth - padding) {
        x = viewportWidth - tooltipRect.width - padding;
        if (side === 'top' || side === 'bottom') arrowX = tooltipRect.width - (viewportWidth - triggerRect.right + triggerRect.width / 2 - padding);
      }
      if (y < padding) {
        y = padding;
        if (side === 'left' || side === 'right') arrowY = triggerRect.top + triggerRect.height / 2 - padding;
      }
      if (y + tooltipRect.height > viewportHeight - padding) {
        y = viewportHeight - tooltipRect.height - padding;
        if (side === 'left' || side === 'right') arrowY = tooltipRect.height - (viewportHeight - triggerRect.bottom + triggerRect.height / 2 - padding);
      }

      setPosition({ x, y });
      setArrowPosition({ x: arrowX, y: arrowY });
    };

    const handleOpen = () => {
      const now = Date.now();
      if (now - lastCloseTimeRef.current < skipDelayDuration) {
        setIsOpen(true);
        return;
      }

      openTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delayMs);
    };

    const handleClose = () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      setIsOpen(false);
      lastCloseTimeRef.current = Date.now();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    useEffect(() => {
      if (isOpen) {
        computePosition();
        window.addEventListener('resize', computePosition);
        window.addEventListener('scroll', computePosition, true);
      }
      return () => {
        window.removeEventListener('resize', computePosition);
        window.removeEventListener('scroll', computePosition, true);
        if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      };
    }, [isOpen, side, align]);

    const triggerProps = {
      ref: triggerRef,
      onMouseEnter: handleOpen,
      onMouseLeave: handleClose,
      onFocus: handleOpen,
      onBlur: handleClose,
      onKeyDown: handleKeyDown,
      'aria-describedby': isOpen ? 'tooltip-content' : undefined,
    };

    // Clone the child element and add trigger props
    const childWithProps = isValidElement(children)
      ? cloneElement(children as ReactElement<any>, triggerProps)
      : children;

    const tooltipContent = isOpen && createPortal(
      <div
        ref={tooltipRef}
        id="tooltip-content"
        role="tooltip"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 700,
        }}
        className={cn(
          'bg-bg-elevated text-text-primary border border-border-standard',
          'rounded-md px-3 py-2 text-caption',
          'shadow-elevated max-w-[280px]',
          'animate-fade-in',
          className
        )}
      >
        {content}
        <div
          style={{
            position: 'absolute',
            left: arrowPosition.x,
            top: arrowPosition.y,
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--color-bg-elevated)',
            borderTop: '1px solid var(--color-border-standard)',
            borderRight: '1px solid var(--color-border-standard)',
          }}
        />
      </div>,
      document.body
    );

    return (
      <div ref={ref} {...props}>
        {childWithProps}
        {tooltipContent}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

/**
 * Simplified TooltipContent for use with Radix-like patterns
 */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      side = 'top',
      align = 'center',
      sideOffset = DEFAULT_SIDE_OFFSET,
      children,
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'bg-bg-elevated text-text-primary border border-border-standard',
        'rounded-md px-3 py-2 text-caption',
        'shadow-elevated max-w-[280px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

TooltipContent.displayName = 'TooltipContent';