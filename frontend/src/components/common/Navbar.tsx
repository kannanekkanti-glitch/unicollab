import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, MessageSquare, Sun, Moon, LogOut, 
  User as UserIcon, Shield, ChevronDown, Check, Sparkles, PlusCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenCreatePost?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreatePost }) => {
  const { user, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    if (user) {
      api.getUnreadNotificationsCount()
        .then(res => setUnreadCount(res.unread_count))
        .catch(() => {});
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const demoAccounts = [
    { name: 'Alex Rivera', role: 'Stanford (AI/ML)', email: 'alex@stanford.edu' },
    { name: 'Priya Sharma', role: 'IIT Bombay (Robotics)', email: 'priya@iitb.ac.in' },
    { name: 'Marcus Chen', role: 'MIT (Full Stack)', email: 'marcus@mit.edu' },
    { name: 'Sophia Davis', role: 'UC Berkeley (UI/UX)', email: 'sophia@berkeley.edu' },
    { name: 'Rohan Verma', role: 'BITS Pilani (Pending Verification)', email: 'rohan@bits.ac.in' },
    { name: 'Platform Admin', role: 'Campus Safety / Admin', email: 'admin@unicollab.edu' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/75 dark:bg-[#090d16]/75 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-sm shadow-black/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link to={user ? "/feed" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300">
              U
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                UniCollab
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Campus
                </span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Verified Student Network
              </p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search posts, teammates, hackathons, fests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/60 border border-transparent focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-inner"
            />
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50/90 text-amber-900 border border-amber-300/60 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:shadow-md hover:shadow-amber-500/10 transition-all duration-200"
              title="Switch demo account"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Switch Persona</span>
              <span className="sm:hidden">Persona</span>
              <ChevronDown className="w-3 h-3 text-amber-600" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-72 glass-card rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 border border-slate-200/80 dark:border-white/10">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Student Persona</span>
                  <span className="text-[10px] text-amber-500">Fast Demo</span>
                </div>
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      demoLogin(account.email);
                      setShowDemoMenu(false);
                      navigate('/feed');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${
                      user?.email === account.email ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-[10px] text-slate-400">{account.role}</p>
                    </div>
                    {user?.email === account.email && (
                      <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" /> : <Moon className="w-5 h-5 text-slate-600 transition-transform rotate-0 hover:-rotate-12" />}
          </button>

          {user ? (
            <>
              {/* Quick Post Button */}
              {onOpenCreatePost && (
                <button
                  onClick={onOpenCreatePost}
                  className="luxury-shimmer-btn hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/25 transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
              )}

              {/* Chat Button */}
              <Link
                to="/chat"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105"
                title="Direct Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* Notifications Button with Radar Pulse Ring */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all duration-300"
                >
                  <Avatar
                    src={user.avatar_url}
                    name={user.full_name}
                    size="sm"
                    isVerified={user.verification_status === 'VERIFIED'}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 glass-card rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 border border-slate-200/80 dark:border-white/10">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                      <div className="mt-2">
                        <Badge
                          type={user.verification_status.toLowerCase() as any}
                          text={user.verification_status === 'VERIFIED' ? 'Verified Student' : 'Pending Verification'}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/profile/${user.id}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-600 dark:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium transition"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                    >
                      <span>Settings & Privacy</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition"
              >
                Join Network
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
