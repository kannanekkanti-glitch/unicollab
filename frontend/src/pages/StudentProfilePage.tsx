import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building, GraduationCap, Code2, 
  Globe, MessageSquare, ShieldCheck, Calendar, 
  Edit3, FolderGit2, FileText, CheckCircle2 
} from 'lucide-react';
import { User, Project, Post } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { PostCard } from '../components/feed/PostCard';
import { Modal } from '../components/common/Modal';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'posts'>('projects');

  // Edit profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const isOwnProfile = currentUser?.id === Number(id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getUser(Number(id))
      .then(userRes => {
        setProfile(userRes);
        setBio(userRes.bio || '');
        setSkills(userRes.skills || '');
        setInterests(userRes.interests || '');
        setGithubUrl(userRes.github_url || '');
        setLinkedinUrl(userRes.linkedin_url || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch projects by this user
    api.getProjects({}).then(allProjects => {
      setProjects(allProjects.filter(p => p.creator.id === Number(id) || p.members.some(m => m.user.id === Number(id))));
    }).catch(() => {});

    // Fetch posts by this user
    api.getPosts('all').then(allPosts => {
      setPosts(allPosts.filter(p => p.author?.id === Number(id)));
    }).catch(() => {});
  }, [id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        bio,
        skills,
        interests,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      });
      setProfile(updated);
      await refreshUser();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 animate-pulse text-xs">
        Loading verified student profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Not Found</h3>
        <p className="text-xs text-slate-500">The requested profile does not exist.</p>
      </div>
    );
  }

  const skillsList = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      {/* Profile Header Banner Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Cover gradient or image */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 relative" />

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <div className="relative inline-block">
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                isVerified={profile.verification_status === 'VERIFIED'}
                className="ring-4 ring-white dark:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2.5">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <Link
                  to={`/chat?user=${profile.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </Link>
              )}
            </div>
          </div>

          {/* Name & College Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {profile.full_name}
              </h2>
              <Badge
                type={profile.verification_status.toLowerCase() as any}
                text={profile.verification_status === 'VERIFIED' ? 'Verified Student' : 'Verification Pending'}
              />
              <span className="text-xs text-slate-400">@{profile.username}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-brand-600" />
                <span className="font-semibold">{profile.college?.name || 'College'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{profile.major || 'Undergraduate'} {profile.graduation_year ? `(Class of ${profile.graduation_year})` : ''}</span>
              </div>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-2 leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            )}

            {/* Skills & Socials */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition" title="GitHub">
                    <Code2 className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition" title="LinkedIn">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'projects'
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'posts'
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Discussions & Posts ({posts.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'projects' ? (
        projects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No projects showcased yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    {proj.domain}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {proj.stage}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {proj.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{proj.members.length} contributors</span>
                  <Link to={`/projects/${proj.id}`} className="text-brand-600 font-semibold hover:underline">
                    View Project &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No campus posts yet.
            </div>
          ) : (
            posts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Student Profile"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students about your interests, current projects..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Python, PyTorch, Docker, UI/UX"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
