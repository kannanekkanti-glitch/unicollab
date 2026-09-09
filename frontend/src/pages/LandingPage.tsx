import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users2, Trophy, Calendar, Boxes, 
  Sparkles, ArrowRight, CheckCircle2, Lock, Flame, Laptop, GraduationCap,
  Star, Check, Layers, Code, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (email: string) => {
    await demoLogin(email);
    navigate('/feed');
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-brand-600/25 via-indigo-500/20 to-violet-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[25%] left-[-100px] w-[500px] h-[500px] bg-emerald-500/15 dark:bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none animate-float-slow" />
      <div className="absolute top-[35%] right-[-100px] w-[600px] h-[600px] bg-violet-600/15 dark:bg-violet-600/10 blur-[140px] rounded-full pointer-events-none animate-float-reverse" />

      {/* Hero Section */}
      <div className="relative pt-20 pb-24 lg:pt-28 lg:pb-36 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Floating Glass Badges (Desktop decoration) */}
          <div className="hidden xl:flex items-center gap-3 absolute -top-4 left-4 p-3.5 rounded-2xl glass-card animate-float shadow-xl border border-white/20 dark:border-white/10 max-w-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Verified Campus ID</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">99.9% Genuine Students</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3 absolute top-12 right-4 p-3.5 rounded-2xl glass-card animate-float-reverse shadow-xl border border-white/20 dark:border-white/10 max-w-xs text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Hackathon Squad</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">TreeHacks</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">3/4 Roster • Need UI/UX</p>
            </div>
          </div>

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 dark:border-brand-400/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm shadow-brand-500/5 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Private & Verified College Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
            The Connected, Trusted <br className="hidden sm:inline" />
            <span className="luxury-gradient-text">
              College Social & Collab Network
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Escape the noise of unverified WhatsApp groups, Telegram spam, and scattered stories. 
            Connect exclusively with verified peers, find hackathon teammates, coordinate campus fests, and build real student projects.
          </p>

          {/* CTA Buttons with Shimmer & Glow */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="luxury-shimmer-btn w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-brand-500/50"
            >
              <span>Join with Student Email</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Sign In to Your Campus</span>
            </Link>
          </div>

          {/* Interactive 1-Click Persona Test-Drive Grid */}
          <div className="mt-14 max-w-3xl mx-auto p-6 rounded-3xl glass-card shadow-2xl border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                Instant Test-Drive: Choose Any Verified Persona
              </span>
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full border border-brand-200/60 dark:border-brand-800/60 hidden sm:inline">
                ⚡ 1-Click Zero Password Login
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[
                { name: 'Alex Rivera', college: 'Stanford • AI/ML', email: 'alex@stanford.edu', ring: 'from-amber-400 to-orange-500', initial: 'A' },
                { name: 'Priya Sharma', college: 'IIT Bombay • Robotics', email: 'priya@iitb.ac.in', ring: 'from-blue-500 to-indigo-600', initial: 'P' },
                { name: 'Marcus Chen', college: 'MIT • Full Stack', email: 'marcus@mit.edu', ring: 'from-purple-500 to-pink-500', initial: 'M' },
                { name: 'Sophia Davis', college: 'UC Berkeley • UI/UX', email: 'sophia@berkeley.edu', ring: 'from-emerald-400 to-teal-500', initial: 'S' },
                { name: 'Rohan Verma', college: 'BITS Pilani • Cloud', email: 'rohan@bits.ac.in', ring: 'from-violet-500 to-cyan-500', initial: 'R' },
                { name: 'Platform Admin', college: 'Safety & Moderation', email: 'admin@unicollab.edu', ring: 'from-rose-500 to-red-600', initial: '⚡' },
              ].map((persona) => (
                <button
                  key={persona.email}
                  onClick={() => handleDemo(persona.email)}
                  className="relative p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 hover:border-brand-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${persona.ring} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {persona.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                        {persona.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {persona.college}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Launch &rarr;
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Metrics Strip */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '24,000+', label: 'Verified Students', desc: 'Across top institutions' },
              { value: '5 Leading', label: 'Partner Campuses', desc: 'Active student networks' },
              { value: '1,450+', label: 'Collaborations', desc: 'Projects & Hackathons' },
              { value: '100%', label: 'Student Verified', desc: 'No bots or outside spam' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl glass-card text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30">
                <div className="text-2xl sm:text-3xl font-black luxury-gradient-text tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{stat.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Feature Pillars with High-Class Visuals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/70 dark:border-white/10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Modern Campus Life</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything Students Need, in One Secure Ecosystem
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Designed from the ground up to replace fragmented chat apps with a structured, verified student network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/25 group-hover:scale-110 transition-transform">
              <Users2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Teammate & Project Matching
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Form dream teams for capstones, research publications, and startups. Filter by exact competencies like PyTorch, React, Rust, or UI/UX Design.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span>Smart matching algorithm</span>
              <span>&rarr;</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hackathon Squad Board
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Never go solo again. Post open roster slots for upcoming hackathons like TreeHacks or HackMIT and recruit verified cross-campus talent with ease.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>Cross-university squads</span>
              <span>&rarr;</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Campus Fests & Workshops
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Discover official college cultural fests, tech symposiums, hackathons, and society workshops with 1-click RSVP tracking and ticket access.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Verified student RSVPs</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Trust Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 py-12 bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center">
              U
            </div>
            <p>© 2026 UniCollab. Dedicated to verified college students across universities worldwide.</p>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Student Login</Link>
            <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Register Campus</Link>
            <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Admin Safety Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

