import React, { useState, useEffect } from 'react';
import { 
  Boxes, Plus, Users, Globe, 
  MessageSquare, Sparkles, Building, Megaphone, CheckCircle2 
} from 'lucide-react';
import { Club } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Create Club Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Selected Club Announcements Modal
  const [activeClub, setActiveClub] = useState<Club | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [postingAnn, setPostingAnn] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Entrepreneurship'];

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const data = await api.getClubs(undefined, selectedCategory !== 'All' ? selectedCategory : undefined);
      setClubs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [selectedCategory]);

  const handleJoinClub = async (clubId: number) => {
    if (!user) return;
    try {
      await api.joinClub(clubId);
      await fetchClubs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createClub({
        name,
        tagline,
        description,
        category,
        instagram_handle: instagram || undefined,
        discord_url: discord || undefined,
      });
      await fetchClubs();
      setShowCreateModal(false);
      setName('');
      setTagline('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to create club');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClub || !announcementTitle.trim() || !announcementContent.trim()) return;

    setPostingAnn(true);
    try {
      await api.postClubAnnouncement(activeClub.id, {
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
      });
      await fetchClubs();
      setAnnouncementTitle('');
      setAnnouncementContent('');
      alert('Announcement published to club members!');
    } catch (err: any) {
      alert(err.message || 'Failed to publish announcement');
    } finally {
      setPostingAnn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Campus Communities</span>
          </div>
          <h2 className="text-2xl font-black">Student Clubs & Societies</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            Join campus chapters, coding groups, entrepreneurship cells, and cultural societies. Follow verified club announcements and recruitment calls.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register a Club</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading student clubs...
        </div>
      ) : clubs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No clubs found</h3>
          <p className="text-xs text-slate-500">Register the first club for your university chapter!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {club.category}
                  </span>
                  <Badge type="college" text={club.college.short_code} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {club.name}
                  </h3>
                  {club.tagline && (
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                      {club.tagline}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>👥 {club.members_count} verified members</span>
                  {club.announcements.length > 0 && (
                    <button
                      onClick={() => setActiveClub(club)}
                      className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>{club.announcements.length} updates</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Join Button and Lead info */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={club.lead.avatar_url}
                    name={club.lead.full_name}
                    size="sm"
                    isVerified={club.lead.verification_status === 'VERIFIED'}
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                      {club.lead.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400">Club President</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveClub(club)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="View Club Info"
                  >
                    <Megaphone className="w-4 h-4" />
                  </button>

                  {user && (
                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition ${
                        club.is_member
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {club.is_member ? 'Member ✓' : 'Join Club'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Club Announcements & Management Modal */}
      <Modal
        isOpen={!!activeClub}
        onClose={() => setActiveClub(null)}
        title={activeClub?.name || 'Club Information'}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeClub?.description}
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">Club Leadership</h4>
            <p className="text-slate-500">
              President / Lead: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeClub?.lead.full_name}</span> ({activeClub?.lead.email})
            </p>
          </div>

          {/* Announcements Feed */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-blue-500" />
              Recent Club Announcements ({activeClub?.announcements.length || 0})
            </h4>

            {activeClub?.announcements.length === 0 ? (
              <p className="text-slate-400 italic">No announcements posted yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {activeClub?.announcements.map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{ann.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Post Announcement Form (For Club Lead or Admin) */}
          {user && (activeClub?.lead.id === user.id || user.role === 'ADMIN') && (
            <form onSubmit={handlePostAnnouncement} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white">Post Announcement to Members</h5>
              <input
                type="text"
                required
                placeholder="Announcement Title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:outline-none"
              />
              <textarea
                rows={2}
                required
                placeholder="Write your announcement details..."
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={postingAnn}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {postingAnn ? 'Posting...' : 'Broadcast Announcement'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Register Club Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Register a Campus Club"
        maxWidth="md"
      >
        <form onSubmit={handleCreateClub} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Club Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google Developer Student Club, E-Cell"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tagline / Mission
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Empowering student founders from dorm to Series A"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            >
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Literary">Literary</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe regular events, recruitment process, and society history..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Instagram Handle (Optional)
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@campus_club"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discord / Slack URL (Optional)
              </label>
              <input
                type="url"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="https://discord.gg/..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register Society'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
