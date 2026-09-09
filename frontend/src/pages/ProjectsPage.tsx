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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Innovation Hub</span>
          </div>
          <h2 className="text-2xl font-black">Student Projects & Collaboration</h2>
          <p className="text-xs text-brand-100 max-w-xl">
            Explore active capstones, research endeavors, and hackathon prototypes built by students. Join open teams or list your own project.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 flex-shrink-0"
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
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                selectedDomain === dom
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found</h3>
          <p className="text-xs text-slate-500">Try adjusting your domain filter or list your project now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const openRolesList = proj.open_roles ? proj.open_roles.split(',').map(r => r.trim()).filter(Boolean) : [];
            const skillsList = proj.skills_required ? proj.skills_required.split(',').map(s => s.trim()).filter(Boolean) : [];

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      {proj.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {proj.stage}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {proj.title}
                    </h3>
                    {proj.tagline && (
                      <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                        {proj.tagline}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  {skillsList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skillsList.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Open Roles banner */}
                  {openRolesList.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1">
                        Looking for Teammates:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {openRolesList.map((role) => (
                          <span key={role} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                            + {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Creator & Apply Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={proj.creator.avatar_url}
                      name={proj.creator.full_name}
                      size="sm"
                      isVerified={proj.creator.verification_status === 'VERIFIED'}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                        {proj.creator.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
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
                        className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white"
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
                        className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition"
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
