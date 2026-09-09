import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users2, Sparkles, Filter, Search, MessageSquare, 
  CheckCircle2, ArrowRight, ShieldCheck, Building, GraduationCap 
} from 'lucide-react';
import { Project, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const FindTeammatesPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'projects' | 'students'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [desiredRole, setDesiredRole] = useState('');
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const roles = [
    'All',
    'ML Researcher',
    'Frontend Developer',
    'Backend Engineer',
    'UI/UX Designer',
    'Mobile Developer',
    'Robotics Engineer'
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projData, studData] = await Promise.all([
        api.getProjects({
          role: selectedRole !== 'All' ? selectedRole : undefined,
          skill: selectedSkill.trim() || undefined,
          search: searchQuery.trim() || undefined,
        }),
        api.searchStudents({
          query: searchQuery.trim() || undefined,
          skill: selectedSkill.trim() || undefined,
        }),
      ]);
      setProjects(projData.filter(p => p.open_roles));
      setStudents(studData.filter(s => s.id !== user?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRole, selectedSkill, searchQuery]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !desiredRole.trim()) return;

    setApplying(true);
    try {
      await api.applyToProject(selectedProject.id, desiredRole.trim(), message.trim());
      setAppliedSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setAppliedSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Intelligent Teammate Finder</span>
        </div>
        <h2 className="text-2xl font-black">Find Teammates & Form Dream Squads</h2>
        <p className="text-xs text-emerald-100 max-w-xl">
          Match with verified college peers for hackathons, term projects, and startups based on technical skills and open project slots.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'projects'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Projects Looking for Members ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'students'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Verified Students Available to Team Up ({students.length})</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                selectedRole === r
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search role or skill (e.g. PyTorch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Searching cross-campus rosters...
        </div>
      ) : activeTab === 'projects' ? (
        projects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No projects matching your role filter currently looking for teammates.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const rolesList = proj.open_roles ? proj.open_roles.split(',').map(r => r.trim()) : [];
              return (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {proj.domain}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Stage: {proj.stage}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {proj.description}
                    </p>

                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Open Squad Roles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rolesList.map((role) => (
                          <span
                            key={role}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-700 shadow-sm"
                          >
                            + {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={proj.creator.avatar_url}
                        name={proj.creator.full_name}
                        size="sm"
                        isVerified={proj.creator.verification_status === 'VERIFIED'}
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                          {proj.creator.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {proj.creator.college?.short_code}
                        </p>
                      </div>
                    </div>

                    {user && user.id !== proj.creator.id && (
                      <button
                        onClick={() => {
                          setSelectedProject(proj);
                          setDesiredRole(rolesList[0] || 'Contributor');
                          setShowApplyModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                      >
                        Apply for Role
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Students Available for Collab */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const skillsList = student.skills ? student.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
            return (
              <div
                key={student.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={student.avatar_url}
                      name={student.full_name}
                      size="lg"
                      isVerified={student.verification_status === 'VERIFIED'}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {student.full_name}
                      </h4>
                      <p className="text-[11px] text-brand-600 font-semibold truncate">
                        {student.college?.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {student.major} {student.graduation_year ? `('26)` : ''}
                      </p>
                    </div>
                  </div>

                  {student.bio && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {student.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {skillsList.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/profile/${student.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    View Profile
                  </Link>

                  <Link
                    to={`/chat?user=${student.id}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${selectedProject?.title}`}
        maxWidth="sm"
      >
        {appliedSuccess ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Application Dispatched!
            </p>
            <p className="text-xs text-slate-500">
              The project lead will receive your profile and contact you via chat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role You are Applying For *
              </label>
              <input
                type="text"
                required
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pitch or Introduction
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention why you'd be a great teammate..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {applying ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
