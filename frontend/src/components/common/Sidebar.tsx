import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, FolderGit2, Users2, Trophy, CalendarDays, 
  Boxes, MessageSquare, Bell, Settings, Shield, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const links = [
    { to: '/feed', label: 'Home Feed', icon: Home },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/find-teammates', label: 'Find Teammates', icon: Users2, highlight: true },
    { to: '/hackathons', label: 'Hackathons', icon: Trophy },
    { to: '/events', label: 'Events & Fests', icon: CalendarDays },
    { to: '/clubs', label: 'Clubs & Society', icon: Boxes },
    { to: '/chat', label: 'Messages', icon: MessageSquare },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    links.push({ to: '/admin', label: 'Admin Dashboard', icon: Shield, highlight: false });
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* User Card Mini */}
        {user && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user.college?.name || 'College Student'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.major || 'Undergraduate'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Status:</span>
              <Badge
                type={user.verification_status.toLowerCase() as any}
                text={user.verification_status === 'VERIFIED' ? 'Verified Student' : 'Pending Verification'}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition group ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    Hot
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Safe Campus Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-brand-500/5 to-purple-500/10 border border-brand-500/20 text-xs">
          <h4 className="font-semibold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            Verified Campus Space
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Zero anonymous spam bots. Exclusively for college students and clubs across verified campus domains.
          </p>
        </div>
      </div>
    </aside>
  );
};
