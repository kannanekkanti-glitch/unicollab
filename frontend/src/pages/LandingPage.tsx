import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users2, Trophy, Calendar, Boxes, 
  Sparkles, ArrowRight, CheckCircle2, Lock, Flame, Laptop, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (email: string) => {
    await demoLogin(email);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 dark:bg-brand-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Exclusively for Verified College Students & Clubs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            The Connected, Trusted <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              College Social & Collab Network
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Escape the noise of unverified WhatsApp groups, Telegram spam, and scattered Instagram stories. 
            Connect with verified peers, find hackathon teammates, coordinate campus fests, and build real student projects.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <span>Join with Student Email</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
            >
              <span>Sign In to Your Campus</span>
            </Link>
          </div>

          {/* Instant 1-Click Interactive Demo Box */}
          <div className="mt-12 max-w-3xl mx-auto p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Drive: Select a Verified Student Persona
              </span>
              <span className="text-[11px] text-brand-600 font-medium hidden sm:inline">
                Instant Login (No password required)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
              {[
                { name: 'Alex Rivera', college: 'Stanford • AI/ML', email: 'alex@stanford.edu', color: 'from-red-500/10 to-orange-500/10' },
                { name: 'Priya Sharma', college: 'IIT Bombay • Robotics', email: 'priya@iitb.ac.in', color: 'from-blue-500/10 to-indigo-500/10' },
                { name: 'Marcus Chen', college: 'MIT • Full Stack', email: 'marcus@mit.edu', color: 'from-purple-500/10 to-pink-500/10' },
                { name: 'Sophia Davis', college: 'UC Berkeley • UI/UX', email: 'sophia@berkeley.edu', color: 'from-emerald-500/10 to-teal-500/10' },
                { name: 'Rohan Verma', college: 'BITS Pilani • Cloud', email: 'rohan@bits.ac.in', color: 'from-amber-500/10 to-yellow-500/10' },
                { name: 'Platform Admin', college: 'Safety & Moderation', email: 'admin@unicollab.edu', color: 'from-slate-500/10 to-gray-500/10' },
              ].map((persona) => (
                <button
                  key={persona.email}
                  onClick={() => handleDemo(persona.email)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200/60 dark:border-slate-800 text-left transition group"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600">
                    {persona.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {persona.college}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-semibold mt-1">
                    Launch Persona &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything College Students Need, in One Secure Ecosystem
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Built from scratch to resolve student fragmentation across fragmented messaging apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center font-bold">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Teammate & Project Matching
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Form dream teams for course capstones, research papers, and startup ventures by filtering for exact skills like PyTorch, React, or UI/UX.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hackathon Squad Board
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Never participate solo again. Post open roster slots for upcoming hackathons like TreeHacks or HackMIT and recruit verified cross-campus talent.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Fests & Workshops
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Discover official college cultural nights, technical fests, guest keynotes, and club workshops with one-click RSVP tracking and ticket access.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Trust Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 UniCollab. Dedicated to verified college students across universities worldwide.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:underline">Student Login</Link>
            <Link to="/register" className="hover:underline">Register Campus</Link>
            <Link to="/admin" className="hover:underline">Admin Safety Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
