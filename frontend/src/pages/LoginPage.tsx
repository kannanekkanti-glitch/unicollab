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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5] dark:bg-[#0c0a09] relative overflow-hidden">
      <div className="absolute inset-0 spotlight-beam pointer-events-none" />
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#150f0b]/85 backdrop-blur-2xl border border-stone-200/80 dark:border-amber-500/[0.12] shadow-2xl shadow-stone-950/5 dark:shadow-black/70 space-y-6 relative specular-top z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 text-stone-950 font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25">
            U
          </div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white font-display">
            Student Sign In
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Access your university feed and private collaboration network
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              College Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                placeholder="e.g. alex@stanford.edu or alex_rivera"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/80 dark:bg-[#100b07]/90 rounded-xl border border-stone-200/80 dark:border-amber-500/[0.1] focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-[#1c140f] focus:outline-none transition-all duration-200 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/80 dark:bg-[#100b07]/90 rounded-xl border border-stone-200/80 dark:border-amber-500/[0.1] focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-[#1c140f] focus:outline-none transition-all duration-200 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Demo Persona Quick Login */}
        <div className="pt-4 border-t border-stone-100 dark:border-amber-500/[0.08]">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Persona Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemo('alex@stanford.edu')}
              className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#1c140f]/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left border border-stone-200/60 dark:border-amber-500/[0.08] hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
            >
              <p className="font-semibold text-stone-800 dark:text-stone-200 font-display">Alex Rivera</p>
              <p className="text-[10px] text-stone-400">Stanford Student</p>
            </button>
            <button
              onClick={() => handleDemo('admin@unicollab.edu')}
              className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#1c140f]/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left border border-stone-200/60 dark:border-amber-500/[0.08] hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
            >
              <p className="font-semibold text-stone-800 dark:text-stone-200 font-display">Admin</p>
              <p className="text-[10px] text-stone-400">Campus Safety</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
            Register your campus
          </Link>
        </p>
      </div>
    </div>
  );
};
