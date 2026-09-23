import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'good'
  | 'moderate'
  | 'warning'
  | 'critical'
  | 'stale'
  | 'offline'
  | 'active'
  | 'resolved'
  | 'open'
  | 'neutral'
  | 'tag';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    critical: 'bg-rose-50 text-rose-700 border-rose-200/80',
    stale: 'bg-amber-50/70 text-amber-800 border-amber-200/60',
    offline: 'bg-slate-100 text-slate-600 border-slate-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    open: 'bg-rose-50 text-rose-700 border-rose-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    tag: 'bg-purple-50 text-purple-700 border-purple-100 font-normal',
  };

  const dotColor: Record<BadgeVariant, string> = {
    good: 'bg-emerald-500',
    moderate: 'bg-amber-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500 animate-pulse',
    stale: 'bg-amber-500',
    offline: 'bg-slate-400',
    active: 'bg-emerald-500',
    resolved: 'bg-emerald-500',
    open: 'bg-rose-500',
    neutral: 'bg-slate-400',
    tag: 'bg-purple-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border transition-colors select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColor[variant])} />}
      <span>{children}</span>
    </span>
  );
};
