import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        email_or_username: identifier.trim(),
        password,
      });
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (email: string) => {
    try {
      await demoLogin(email);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafbfc] dark:bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 spotlight-beam pointer-events-none" />
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#080d1a]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl shadow-slate-900/5 dark:shadow-black/70 space-y-6 relative specular-top z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25">
            U
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Student Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your university feed and private collaboration network
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. alex@stanford.edu or alex_rivera"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 dark:bg-[#060a16]/80 rounded-xl border border-slate-200/80 dark:border-white/[0.08] focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-[#0b1124] focus:outline-none transition-all duration-200 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 dark:bg-[#060a16]/80 rounded-xl border border-slate-200/80 dark:border-white/[0.08] focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-[#0b1124] focus:outline-none transition-all duration-200 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Demo Persona Quick Login */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Persona Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemo('alex@stanford.edu')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1124]/60 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 text-left border border-slate-200/60 dark:border-white/[0.06] hover:border-brand-500/40 transition-all duration-200 cursor-pointer"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-200">Alex Rivera</p>
              <p className="text-[10px] text-slate-400">Stanford Student</p>
            </button>
            <button
              onClick={() => handleDemo('admin@unicollab.edu')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1124]/60 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 text-left border border-slate-200/60 dark:border-white/[0.06] hover:border-brand-500/40 transition-all duration-200 cursor-pointer"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-200">Admin</p>
              <p className="text-[10px] text-slate-400">Campus Safety</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Register your campus
          </Link>
        </p>
      </div>
    </div>
  );
};
