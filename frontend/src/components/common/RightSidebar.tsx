import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, UserPlus, Flame } from 'lucide-react';
import { Event, Hackathon, User } from '../../types';
import { api } from '../../services/api';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

export const RightSidebar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [peers, setPeers] = useState<User[]>([]);

  useEffect(() => {
    api.getEvents().then(res => setEvents(res.slice(0, 2))).catch(() => {});
    api.getHackathons().then(res => setHackathons(res.slice(0, 2))).catch(() => {});
    api.searchStudents({}).then(res => setPeers(res.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:block space-y-6">
      <div className="sticky top-20 space-y-6">
        {/* Trending Tags Widget */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Trending on Campus
            </h3>
          </div>
          <div className="space-y-2.5">
            {[
              { tag: '#TreeHacks2026', count: '142 discussions', category: 'Hackathons' },
              { tag: '#CS229Midterms', count: '89 students studying', category: 'Exams' },
              { tag: '#TechfestMumbai', count: '230 RSVPs', category: 'Fests' },
              { tag: '#AIResearchCollab', count: '45 open roles', category: 'Projects' },
            ].map((item) => (
              <div key={item.tag} className="group cursor-pointer">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition">
                  {item.tag}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Fests & Hackathons */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-500" />
              Upcoming Fests & Jams
            </h3>
            <Link to="/events" className="text-[11px] font-semibold text-brand-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {ev.category}
                </span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  📍 {ev.location}
                </p>
              </div>
            ))}

            {hackathons.map((h) => (
              <div key={h.id} className="p-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-100 dark:border-violet-900/40">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                  Hackathon
                </span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {h.title}
                </h4>
                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                  🏆 Prize: {h.prize_pool}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Student Peers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Verified Peers to Connect
            </h3>
            <Link to="/find-teammates" className="text-[11px] font-semibold text-brand-600 hover:underline">
              Find more
            </Link>
          </div>

          <div className="space-y-3">
            {peers.map((peer) => (
              <div key={peer.id} className="flex items-center justify-between gap-2">
                <Link to={`/profile/${peer.id}`} className="flex items-center gap-2.5 min-w-0 group">
                  <Avatar
                    src={peer.avatar_url}
                    name={peer.full_name}
                    size="sm"
                    isVerified={peer.verification_status === 'VERIFIED'}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition truncate">
                      {peer.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {peer.college?.short_code || 'Student'} • {peer.major || 'Undergrad'}
                    </p>
                  </div>
                </Link>

                <Link
                  to={`/chat?user=${peer.id}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
                  title="Message peer"
                >
                  <UserPlus className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
