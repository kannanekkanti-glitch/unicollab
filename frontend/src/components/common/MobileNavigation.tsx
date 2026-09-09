import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderGit2, Users2, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNavigation: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/feed', label: 'Feed', icon: Home },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/find-teammates', label: 'Teammates', icon: Users2 },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: user ? `/profile/${user.id}` : '/login', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-medium transition ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
