'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type TriangleOrientation = 'up' | 'down' | 'left' | 'right';
export type TriangleSize = 'sm' | 'md' | 'lg';

interface GoldTriangleProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: TriangleOrientation;
  size?: TriangleSize;
  className?: string;
  /** Whether to show subtle pulse animation (hero only) */
  pulse?: boolean;
}

const sizeStyles: Record<TriangleSize, React.CSSProperties> = {
  sm: {
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '10px solid',
  },
  md: {
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '14px solid',
  },
  lg: {
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderBottom: '20px solid',
  },
};

const orientationStyles: Record<TriangleOrientation, React.CSSProperties> = {
  up: {
    borderBottom: 'none',
    borderTop: '14px solid',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
  },
  down: {
    borderBottom: '14px solid',
    borderTop: 'none',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
  },
  left: {
    borderRight: '14px solid',
    borderLeft: 'none',
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
  },
  right: {
    borderLeft: '14px solid',
    borderRight: 'none',
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
  },
};

export const GoldTriangle = forwardRef<HTMLDivElement, GoldTriangleProps>(
  (
    {
      orientation = 'down',
      size = 'md',
      pulse = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseSizeStyle = sizeStyles[size];
    const orientationStyle = orientationStyles[orientation];

    // For up/down, adjust border colors
    // For left/right, adjust border colors
    const colorStyle: React.CSSProperties = {
      borderBottomColor: 'var(--color-accent-gold)',
      borderTopColor: 'var(--color-accent-gold)',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    };

    const combinedStyle: React.CSSProperties = {
      ...baseSizeStyle,
      ...orientationStyle,
      ...colorStyle,
      ...style,
    };

    // For left/right orientations, the border colors need adjustment
    if (orientation === 'left') {
      combinedStyle.borderRightColor = 'var(--color-accent-gold)';
      combinedStyle.borderBottomColor = 'transparent';
      combinedStyle.borderTopColor = 'transparent';
    } else if (orientation === 'right') {
      combinedStyle.borderLeftColor = 'var(--color-accent-gold)';
      combinedStyle.borderBottomColor = 'transparent';
      combinedStyle.borderTopColor = 'transparent';
    }

    return (
      <div
        ref={ref}
        role="img"
        aria-label="Gold triangle accent"
        className={cn(
          'inline-block',
          'select-none',
          pulse && 'animate-pulse-gold',
          className
        )}
        style={combinedStyle}
        {...props}
      />
    );
  }
);

GoldTriangle.displayName = 'GoldTriangle';

/**
 * GoldTriangleCorner - positioned in corner of a container
 */
interface GoldTriangleCornerProps extends HTMLAttributes<HTMLDivElement> {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: TriangleSize;
}

export function GoldTriangleCorner({
  position = 'top-right',
  size = 'md',
  className,
  ...props
}: GoldTriangleCornerProps) {
  const positionStyles: Record<NonNullable<GoldTriangleCornerProps['position']>, React.CSSProperties> = {
    'top-left': { top: 0, left: 0 },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
  };

  return (
    <div
      className={cn('relative', className)}
      {...props}
    >
      <GoldTriangle
        size={size}
        orientation={position.includes('top') ? 'down' : 'up'}
        style={positionStyles[position]}
        className="absolute"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * GoldTriangleSection - section divider with gold triangle
 */
interface GoldTriangleSectionProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'up' | 'down';
  size?: TriangleSize;
}

export function GoldTriangleSection({
  orientation = 'down',
  size = 'md',
  children,
  className,
  ...props
}: GoldTriangleSectionProps) {
  return (
    <div
      className={cn('relative flex flex-col items-center', className)}
      {...props}
    >
      <GoldTriangle
        orientation={orientation}
        size={size}
        className="mb-4"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}