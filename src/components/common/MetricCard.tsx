import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

export type MetricVariant = 'good' | 'warning' | 'critical' | 'neutral' | 'amber';

interface MetricCardProps {
  value: string | number;
  label: string;
  subtext?: string;
  icon?: ReactNode;
  variant?: MetricVariant;
  onClick?: () => void;
  active?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  subtext,
  icon,
  variant = 'neutral',
  onClick,
  active = false,
}) => {
  const variantStyles: Record<MetricVariant, { bg: string; text: string; labelColor: string; border: string; subtextColor: string }> = {
    good: {
      bg: 'bg-[#E8F8F5] hover:bg-[#DEFAF4]',
      text: 'text-emerald-700',
      labelColor: 'text-emerald-950 font-bold',
      subtextColor: 'text-emerald-700/80 font-medium',
      border: 'border-emerald-200/80',
    },
    amber: {
      bg: 'bg-[#FFFBEB] hover:bg-[#FEF3C7]',
      text: 'text-amber-700',
      labelColor: 'text-amber-950 font-bold',
      subtextColor: 'text-amber-700/80 font-medium',
      border: 'border-amber-200/80',
    },
    warning: {
      bg: 'bg-[#FFF4ED] hover:bg-[#FFE8D6]',
      text: 'text-orange-700',
      labelColor: 'text-orange-950 font-bold',
      subtextColor: 'text-orange-700/80 font-medium',
      border: 'border-orange-200/80',
    },
    critical: {
      bg: 'bg-[#FEF2F2] hover:bg-[#FEE2E2]',
      text: 'text-rose-700',
      labelColor: 'text-rose-950 font-bold',
      subtextColor: 'text-rose-700/80 font-medium',
      border: 'border-rose-200/80',
    },
    neutral: {
      bg: 'bg-[#EAF7F4] hover:bg-[#DEFAF4]',
      text: 'text-[#217C70]',
      labelColor: 'text-slate-900 font-bold',
      subtextColor: 'text-slate-600 font-medium',
      border: 'border-teal-200/80',
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden',
        current.bg,
        current.border,
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        active && 'ring-2 ring-[#217C70] border-transparent shadow-sm'
      )}
    >
      {/* Icon Row */}
      <div className="flex items-center justify-between">
        {icon && <div className={clsx('text-xl opacity-90', current.text)}>{icon}</div>}
      </div>

      {/* Numerical Value & Label */}
      <div className="mt-3">
        <div className={clsx('text-3xl sm:text-4xl font-black tracking-tight tabular-nums', current.text)}>
          {value}
        </div>
        <div className={clsx('text-sm mt-1', current.labelColor)}>{label}</div>
        {subtext && <div className={clsx('text-xs mt-0.5', current.subtextColor)}>{subtext}</div>}
      </div>
    </div>
  );
};
