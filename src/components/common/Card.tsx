import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-white/75 backdrop-blur-md border border-white/90 rounded-3xl shadow-sm transition-all duration-300',
          hoverable && 'hover:border-white hover:bg-white/85 hover:shadow-xl hover:-translate-y-1 cursor-pointer',
          className
        )
      )}
    >
      {children}
    </div>
  );
};
