'use client';

import { forwardRef, HTMLAttributes, useState, useRef, useEffect, KeyboardEvent, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  value: string;
  disabled?: boolean;
}

interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onChange,
      children,
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleChange = (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value, onChange: handleChange, orientation }}>
        <div
          ref={ref}
          className={cn(className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useTabsContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'flex items-center gap-1',
          'bg-bg-panel border border-border-subtle rounded-lg p-1',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ value, disabled = false, children, className, ...props }, ref) => {
    const { value: currentValue, onChange, orientation } = useTabsContext();
    const isSelected = currentValue === value;
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
      if (!disabled) {
        onChange(value);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const triggers = Array.from(
        triggerRef.current?.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]:not([disabled])') || []
      ) as HTMLButtonElement[];
      const currentIndex = triggers.indexOf(triggerRef.current!);

      let nextIndex = currentIndex;
      const isHorizontal = orientation === 'horizontal';

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = isHorizontal ? (currentIndex + 1) % triggers.length : currentIndex;
          break;
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = isHorizontal ? (currentIndex - 1 + triggers.length) % triggers.length : currentIndex;
          break;
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = !isHorizontal ? (currentIndex + 1) % triggers.length : currentIndex;
          break;
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = !isHorizontal ? (currentIndex - 1 + triggers.length) % triggers.length : currentIndex;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = triggers.length - 1;
          break;
      }

      if (nextIndex !== currentIndex && triggers[nextIndex]) {
        triggers[nextIndex].focus();
        onChange(triggers[nextIndex].getAttribute('data-value') || '');
      }
    };

    return (
      <button
        ref={(el) => {
          triggerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-value={value}
        id={`tab-${value}`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex items-center justify-center',
          'font-body text-sm font-medium',
          'rounded-md',
          'transition-all duration-standard ease-out-expo',
          'focus-visible:outline-none focus-visible:shadow-focus',
          'touch-target min-w-[72px]',
          isSelected
            ? 'bg-accent-gold text-bg-primary font-semibold shadow-sm'
            : 'text-text-muted hover:text-text-primary hover:bg-bg-hover',
          disabled && 'opacity-40 cursor-not-allowed',
          orientation === 'horizontal' ? 'px-4 py-2' : 'w-full px-3 py-2 text-left',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabTrigger.displayName = 'TabTrigger';

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ value, forceMount = false, children, className, ...props }, ref) => {
    const { value: currentValue } = useTabsContext();
    const isSelected = currentValue === value;

    if (!forceMount && !isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        aria-labelledby={`tab-${value}`}
        hidden={!isSelected}
        className={cn(
          'mt-4',
          'animate-slide-up',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabContent.displayName = 'TabContent';