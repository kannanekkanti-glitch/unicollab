import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isVerified = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-semibold flex items-center justify-center border border-white/20 shadow-sm`}
        >
          {getInitials(name || 'Student')}
        </div>
      )}

      {isVerified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white dark:ring-slate-900 shadow-sm"
          title="Verified Student"
        >
          <ShieldCheck className="w-3 h-3 stroke-[3]" />
        </span>
      )}
    </div>
  );
};
