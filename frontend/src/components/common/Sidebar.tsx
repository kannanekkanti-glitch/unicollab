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
      <div className="sticky top-20 space-y-5">
        {/* User Card Mini */}
        {user && (
          <div className="p-4 rounded-2xl glass-card transition-all duration-300 hover:shadow-xl hover:border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate font-display">
                  {user.college?.name || 'College Student'}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  {user.major || 'Undergraduate'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-amber-500/[0.1] flex items-center justify-between text-[11px]">
              <span className="text-stone-500 dark:text-stone-400 font-medium">Status:</span>
              <Badge
                type={user.verification_status.toLowerCase() as any}
                text={user.verification_status === 'VERIFIED' ? 'Verified Student' : 'Pending Verification'}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2 rounded-2xl glass-card space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-800 dark:text-amber-300 font-bold shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100/80 dark:hover:bg-[#1c140f]/80 hover:text-stone-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-500 rounded-r-full shadow-sm shadow-amber-500" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 group-hover:text-amber-500'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.highlight && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse">
                        Hot
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Safe Campus Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-brown-600/10 to-amber-700/15 border border-amber-500/30 text-xs shadow-md shadow-amber-500/5">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-display">
            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Verified Campus Space
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-300/90 mt-1 leading-relaxed">
            Zero anonymous spam bots. Exclusively for college students and clubs across verified campus domains.
          </p>
        </div>
      </div>
    </aside>
  );
};
