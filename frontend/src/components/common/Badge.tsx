import React from 'react';
import { ShieldCheck, Sparkles, Building, AlertCircle } from 'lucide-react';

interface BadgeProps {
  type?: 'verified' | 'pending' | 'rejected' | 'college' | 'role' | 'category';
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'verified',
  text,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  if (type === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 ${sizeClasses} ${className}`}
        title="Verified College Student"
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {text || 'Verified Student'}
      </span>
    );
  }

  if (type === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ${sizeClasses} ${className}`}
        title="Verification In Review"
      >
        <AlertCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {text || 'Verification Pending'}
      </span>
    );
  }

  if (type === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 ${sizeClasses} ${className}`}
      >
        {text || 'Unverified'}
      </span>
    );
  }

  if (type === 'college') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 ${sizeClasses} ${className}`}
      >
        <Building className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {text}
      </span>
    );
  }

  if (type === 'category') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${sizeClasses} ${className}`}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 ${sizeClasses} ${className}`}
    >
      <Sparkles className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};
