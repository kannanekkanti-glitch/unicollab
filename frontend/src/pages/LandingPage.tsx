import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users2, Trophy, Calendar, Boxes, 
  Sparkles, ArrowRight, CheckCircle2, Lock, Flame, Laptop, GraduationCap,
  Star, Check, Layers, Code, Zap, Globe, MessageSquare, ArrowUpRight, Award, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (email: string) => {
    await demoLogin(email);
    navigate('/feed');
  };

  const partnerUniversities = [
    { name: 'Stanford University', code: 'STANFORD', loc: 'California', color: 'from-red-500/20 to-amber-500/10' },
    { name: 'Massachusetts Institute of Tech', code: 'MIT', loc: 'Cambridge', color: 'from-purple-500/20 to-indigo-500/10' },
    { name: 'Indian Institute of Tech Bombay', code: 'IIT BOMBAY', loc: 'Mumbai', color: 'from-blue-500/20 to-cyan-500/10' },
    { name: 'BITS Pilani', code: 'BITS', loc: 'Pilani & Goa', color: 'from-amber-500/20 to-yellow-500/10' },
    { name: 'University of California Berkeley', code: 'UC BERKELEY', loc: 'Berkeley', color: 'from-emerald-500/20 to-teal-500/10' },
  ];

  return (
    <div className="relative min-h-screen bg-[#fafbfc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* Overhead Spotlight Atmospheric Beam */}
      <div className="spotlight-beam absolute inset-x-0 top-0 h-[700px] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[-150px] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-150px] w-[500px] h-[500px] bg-violet-600/10 dark:bg-violet-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Floating Laser Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.12] backdrop-blur-xl text-xs font-semibold mb-8 shadow-sm hover:border-brand-500/40 transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-700 dark:text-slate-300 tracking-wide font-medium">
            Dedicated Exclusively to Verified University Students & Societies
          </span>
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded-full border border-brand-200/60 dark:border-brand-800/60">
            v2.0
          </span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] max-w-5xl mx-auto font-display">
          <span className="headline-gradient">
            The Private Social & Collab Network for
          </span>
          <br />
          <span className="luxury-gradient-text">
            World-Class College Students.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mt-7 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          Escape chaotic WhatsApp groups, Telegram spam, and scattered stories. 
          UniCollab connects verified campus minds to build capstones, recruit hackathon squads, and coordinate college fests in one secure ecosystem.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/register"
            className="luxury-shimmer-btn w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            <span>Join with Student Email</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bento-card hover:bg-white dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Sign In to Campus</span>
          </Link>
        </div>

        {/* Instant 1-Click Persona Access Badges */}
        <div className="mt-16 max-w-4xl mx-auto p-6 sm:p-7 rounded-3xl bento-card specular-top text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-display">
                Executive Test-Drive: Select an Authenticated Student Keycard
              </span>
            </div>
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 hidden sm:inline">
              ⚡ Instant 1-Click Access
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-5">
            {[
              { name: 'Alex Rivera', role: 'AI/ML Researcher', college: 'Stanford University', email: 'alex@stanford.edu', color: 'from-red-500 to-amber-500', verified: true },
              { name: 'Priya Sharma', role: 'Robotics Lead', college: 'IIT Bombay', email: 'priya@iitb.ac.in', color: 'from-blue-500 to-indigo-600', verified: true },
              { name: 'Marcus Chen', role: 'Full-Stack Developer', college: 'MIT', email: 'marcus@mit.edu', color: 'from-purple-500 to-pink-500', verified: true },
              { name: 'Sophia Davis', role: 'UI/UX Designer', college: 'UC Berkeley', email: 'sophia@berkeley.edu', color: 'from-emerald-400 to-teal-500', verified: true },
              { name: 'Rohan Verma', role: 'Cloud Computing', college: 'BITS Pilani', email: 'rohan@bits.ac.in', color: 'from-amber-400 to-orange-500', verified: false },
              { name: 'Platform Admin', role: 'Trust & Safety Director', college: 'UniCollab HQ', email: 'admin@unicollab.edu', color: 'from-rose-500 to-red-600', verified: true },
            ].map((persona) => (
              <button
                key={persona.email}
                onClick={() => handleDemo(persona.email)}
                className="group relative p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200/70 dark:border-white/[0.08] hover:border-brand-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${persona.color} flex items-center justify-center text-white text-xs font-black shadow-md`}>
                    {persona.name[0]}
                  </div>
                  {persona.verified ? (
                    <span className="text-emerald-500 verified-badge-glow" title="Verified Campus Student">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Review</span>
                  )}
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {persona.name}
                </h4>
                <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-0.5 truncate">
                  {persona.role}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {persona.college}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-brand-500 transition-colors">
                  <span>Enter Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* University Trust Marquee */}
      <div className="py-14 border-y border-slate-200/70 dark:border-white/[0.08] bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mb-6 font-display">
            Built for Verified Students at Leading Global Campuses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {partnerUniversities.map((uni) => (
              <div
                key={uni.code}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bento-card border border-slate-200/70 dark:border-white/[0.08] hover:border-brand-500/40 transition-all duration-300"
              >
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${uni.color} flex items-center justify-center font-black text-xs text-slate-800 dark:text-slate-200 border border-white/20`}>
                  <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-800 dark:text-slate-200">{uni.name}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">{uni.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold mb-3 border border-brand-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Architected for Modern Campus Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Everything College Students Need, <br className="hidden sm:inline" />
            Engineered with Precision.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 font-normal">
            No outside clutter. No anonymous trolls. Just verified collegiate peers collaborating on what matters.
          </p>
        </div>

        {/* Modern Bento Grid (4 modular boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Box 1: Large Featured Card (2 columns) */}
          <div className="md:col-span-2 p-8 rounded-3xl bento-card bento-card-hover specular-top flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/25">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Intelligent Teammate & Project Matching
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Filter by exact competencies like PyTorch, Next.js, Rust, or Figma. Recruit cross-department talent for research papers, final year capstones, and startup prototypes.
              </p>
            </div>

            {/* Interactive Mockup Preview inside Bento */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/70 dark:border-white/[0.08] space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Autonomous Medical EHR Capstone
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold border border-brand-500/20">
                  Stanford • AI/ML
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                  PyTorch
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                  FastAPI
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold">
                  + Looking for UI/UX Lead
                </span>
              </div>
            </div>
          </div>

          {/* Bento Box 2: Hackathon Squad Board */}
          <div className="p-8 rounded-3xl bento-card bento-card-hover specular-top flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/25">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                Hackathon Squads
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Post open roster slots for upcoming hackathons like TreeHacks or HackMIT. Form dream squads before registration closes.
              </p>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">Next Upcoming Sprint</span>
              <div className="text-xs font-black text-slate-900 dark:text-white">TreeHacks 2026 • Stanford</div>
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">🏆 $100,000+ Prize Pool</div>
            </div>
          </div>

          {/* Bento Box 3: Campus Fests & Workshops */}
          <div className="p-8 rounded-3xl bento-card bento-card-hover specular-top flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/25">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                Campus Fests & RSVPs
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Discover official cultural fests, tech symposiums, hackathons, and society workshops with instant 1-click RSVP tracking.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Techfest 2026 Pass</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Verified ✓
              </span>
            </div>
          </div>

          {/* Bento Box 4: Verified Student Cryptographic ID (2 columns) */}
          <div className="md:col-span-2 p-8 rounded-3xl bento-card bento-card-hover specular-top flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Institutional ID & Email Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Every user is verified via their registered institutional domain (`.edu`, `.ac.in`) alongside physical college ID card review by campus administrators. Zero outside bots, zero spam.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>6-Digit Institutional OTP</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Physical Student ID Card Inspection</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Encrypted WebSocket Direct Messaging</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Safety & Trust Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] py-14 bg-white/60 dark:bg-[#02050c]/80 backdrop-blur-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              U
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">UniCollab Platform</p>
              <p className="text-[11px] text-slate-400">Dedicated to verified university students across the globe.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 font-bold">
            <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Student Login</Link>
            <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Register Campus</Link>
            <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Admin Safety Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

