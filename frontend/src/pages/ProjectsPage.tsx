import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, Plus, Users2, Code2, ExternalLink, 
  Sparkles, CheckCircle2, Search, Filter 
} from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Project Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('AI / ML');
  const [stage, setStage] = useState('In Progress');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [openRoles, setOpenRoles] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [creating, setCreating] = useState(false);

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [desiredRole, setDesiredRole] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const domains = ['All', 'AI / ML', 'Web Development', 'Hardware / IoT', 'Mobile App', 'Cybersecurity'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects({
        domain: selectedDomain !== 'All' ? selectedDomain : undefined,
        search: searchQuery.trim() || undefined,
      });
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDomain, searchQuery]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newProj = await api.createProject({
        title,
        tagline,
        description,
        domain,
        stage,
        skills_required: skillsRequired,
        open_roles: openRoles,
        repo_url: repoUrl || undefined,
        demo_url: demoUrl || undefined,
      });
      setProjects([newProj, ...projects]);
      setShowCreateModal(false);
      // Reset
      setTitle('');
      setTagline('');
      setDescription('');
      setSkillsRequired('');
      setOpenRoles('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !desiredRole.trim()) return;

    setApplying(true);
    try {
      await api.applyToProject(selectedProject.id, desiredRole.trim(), applyMessage.trim());
      setAppliedSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setAppliedSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to apply to project');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-brand-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Innovation Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Student Projects & Collaboration</h2>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl font-normal leading-relaxed">
            Explore active capstones, research endeavors, and hackathon prototypes built by students. Join open teams or list your own project.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="luxury-shimmer-btn px-5 py-3 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-extrabold text-xs shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0 relative z-10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List Your Project</span>
          </button>
        )}
      </div>

      {/* Domain Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold transition-all duration-200 cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                  : 'glass-card text-slate-600 dark:text-slate-400 hover:text-brand-600 hover:border-brand-400'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/60 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-3xl glass-card animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card space-y-3">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No projects found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const skillsList = proj.skills_required ? proj.skills_required.split(',').map(s => s.trim()).filter(Boolean) : [];
            const openRolesList = proj.open_roles ? proj.open_roles.split(',').map(r => r.trim()).filter(Boolean) : [];

            return (
              <div
                key={proj.id}
                className="p-6 rounded-3xl glass-card glass-card-hover flex flex-col justify-between space-y-5 relative group border border-slate-200/80 dark:border-white/10"
              >
                <div className="space-y-3">
                  {/* Top domain badge & stage */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                      {proj.domain}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5">
                      {proj.stage}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {proj.title}
                    </h3>
                    {proj.tagline && (
                      <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                        {proj.tagline}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  {skillsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skillsList.map((skill) => (
                        <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-semibold border border-slate-200/60 dark:border-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Open Roles banner */}
                  {openRolesList.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-700/50 shadow-sm">
                      <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <span>🔥</span>
                        <span>Looking for Teammates:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {openRolesList.map((role) => (
                          <span key={role} className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold border border-amber-300 dark:border-amber-700 shadow-sm">
                            + {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Creator & Apply Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={proj.creator.avatar_url}
                      name={proj.creator.full_name}
                      size="sm"
                      isVerified={proj.creator.verification_status === 'VERIFIED'}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs">
                        {proj.creator.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {proj.creator.college?.short_code || 'Student'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.repo_url && (
                      <a
                        href={proj.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="GitHub Repository"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}

                    {user && user.id !== proj.creator.id && (
                      <button
                        onClick={() => {
                          setSelectedProject(proj);
                          setDesiredRole(openRolesList[0] || 'Contributor');
                          setShowApplyModal(true);
                        }}
                        className="luxury-shimmer-btn px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        Apply to Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="List a Campus Project"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus RideShare, Autonomous Drone, Medical EHR LLM"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tagline (One-line pitch)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. A privacy-preserving AI assistant for doctor notes"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Domain / Field
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              >
                <option value="AI / ML">AI / ML</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Hardware / IoT">Hardware / IoT</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Blockchain">Blockchain</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              >
                <option value="Ideation">Ideation</option>
                <option value="In Progress">In Progress</option>
                <option value="MVP Ready">MVP Ready</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem your project solves, architecture, and goals..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skills Needed (comma separated)
              </label>
              <input
                type="text"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                placeholder="e.g. PyTorch, React, ROS2"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Open Roles for Teammates
              </label>
              <input
                type="text"
                value={openRoles}
                onChange={(e) => setOpenRoles(e.target.value)}
                placeholder="e.g. Frontend Dev, UI/UX Designer"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository (Optional)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Live Demo Link (Optional)
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {creating ? 'Listing Project...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Apply to Project Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${selectedProject?.title}`}
        maxWidth="sm"
      >
        {appliedSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Application Sent!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              The project creator has been notified and will review your request.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Desired Role *
              </label>
              <input
                type="text"
                required
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                placeholder="e.g. Frontend Developer, UI Designer, ML Researcher"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Note to Project Lead
              </label>
              <textarea
                rows={3}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Highlight your experience or relevant course projects..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Send Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
