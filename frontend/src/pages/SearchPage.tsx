import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Users, FileText, FolderGit2, Trophy, 
  Calendar, Boxes, Sparkles, Building, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'posts' | 'projects' | 'hackathons' | 'events' | 'clubs'>('all');

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    api.globalSearch(query)
      .then(res => setResults(res.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">
          Campus Universal Search
        </h2>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across students, discussions, projects, hackathons, and clubs..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Tab Filters */}
        {results && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {[
              { id: 'all', label: `All (${results.total_count})` },
              { id: 'students', label: `Students (${results.students?.length || 0})` },
              { id: 'posts', label: `Posts (${results.posts?.length || 0})` },
              { id: 'projects', label: `Projects (${results.projects?.length || 0})` },
              { id: 'hackathons', label: `Hackathons (${results.hackathons?.length || 0})` },
              { id: 'events', label: `Fests & Events (${results.events?.length || 0})` },
              { id: 'clubs', label: `Clubs (${results.clubs?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Searching universe of campus content...
        </div>
      ) : !results ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Enter a search keyword to discover campus discussions and collaborators.
        </div>
      ) : results.total_count === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          No matches found for "{query}". Try another query or check spelling.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Students Section */}
          {(activeTab === 'all' || activeTab === 'students') && results.students?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-500" /> Students
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {results.students.map((s: any) => (
                  <Link
                    key={s.id}
                    to={`/profile/${s.id}`}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:border-brand-400 transition"
                  >
                    <Avatar
                      src={s.avatar_url}
                      name={s.full_name}
                      size="md"
                      isVerified={s.verification_status === 'VERIFIED'}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {s.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {s.major}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {(activeTab === 'all' || activeTab === 'projects') && results.projects?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" /> Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.projects.map((p: any) => (
                  <Link
                    key={p.id}
                    to="/projects"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {p.domain}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {p.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-500" /> Feed Discussions
              </h3>
              <div className="space-y-2.5">
                {results.posts.map((post: any) => (
                  <Link
                    key={post.id}
                    to="/feed"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm block hover:border-brand-400 transition"
                  >
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {post.content}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hackathons Section */}
          {(activeTab === 'all' || activeTab === 'hackathons') && results.hackathons?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-violet-500" /> Hackathons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.hackathons.map((h: any) => (
                  <Link
                    key={h.id}
                    to="/hackathons"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 hover:border-brand-400 transition"
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                      {h.mode}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white pt-1">
                      {h.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {h.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {(activeTab === 'all' || activeTab === 'events') && results.events?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Fests & Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.events.map((ev: any) => (
                  <Link
                    key={ev.id}
                    to="/events"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 hover:border-brand-400 transition"
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                      {ev.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white pt-1">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {ev.location} • {new Date(ev.start_time).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
