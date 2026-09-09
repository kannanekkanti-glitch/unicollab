import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, MapPin, Users, Plus, 
  ExternalLink, Sparkles, CheckCircle2, UserCheck 
} from 'lucide-react';
import { Hackathon, HackathonTeam } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';

export const HackathonsPage: React.FC = () => {
  const { user } = useAuth();

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('All');

  // Create Team Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [lookingForRoles, setLookingForRoles] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [submittingTeam, setSubmittingTeam] = useState(false);

  // Join Team Modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<HackathonTeam | null>(null);
  const [joinRole, setJoinRole] = useState('Developer');
  const [joinMessage, setJoinMessage] = useState('');
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const data = await api.getHackathons(selectedMode !== 'All' ? selectedMode : undefined);
      setHackathons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [selectedMode]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathon || !teamName.trim()) return;

    setSubmittingTeam(true);
    try {
      await api.createHackathonTeam(selectedHackathon.id, {
        team_name: teamName.trim(),
        description: teamDescription.trim() || undefined,
        looking_for_roles: lookingForRoles.trim() || undefined,
        max_members: maxMembers,
      });
      await fetchHackathons();
      setShowTeamModal(false);
      setTeamName('');
      setTeamDescription('');
      setLookingForRoles('');
    } catch (err: any) {
      alert(err.message || 'Failed to create team');
    } finally {
      setSubmittingTeam(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    setSubmittingJoin(true);
    try {
      await api.applyToHackathonTeam(selectedTeam.id, joinRole, joinMessage);
      setJoinSuccess(true);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setSubmittingJoin(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20 space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>Competitions & Sprints</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Collegiate Hackathons & Squads</h2>
        <p className="text-xs sm:text-sm text-violet-100 max-w-xl font-normal leading-relaxed">
          Discover top collegiate hackathons, form cross-campus squads, and lock in your roster before registration deadlines.
        </p>
      </div>

      {/* Mode Filters */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        {['All', 'In-Person', 'Hybrid', 'Online'].map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`px-4 py-1.5 rounded-full font-bold transition-all duration-200 cursor-pointer ${
              selectedMode === mode
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                : 'glass-card text-slate-600 dark:text-slate-400 hover:text-violet-600 hover:border-violet-400'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Hackathons List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading hackathons and team boards...
        </div>
      ) : (
        <div className="space-y-6">
          {hackathons.map((h) => (
            <div
              key={h.id}
              className="p-6 sm:p-7 rounded-3xl glass-card glass-card-hover space-y-5 border border-slate-200/80 dark:border-white/10 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                      {h.mode}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Organized by <strong className="text-slate-700 dark:text-slate-300">{h.organizer}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {h.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {h.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1.5 font-semibold">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      <span>🏆 Prize:</span>
                      <strong className="font-extrabold">{h.prize_pool}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      {new Date(h.start_date).toLocaleDateString()} - {new Date(h.end_date).toLocaleDateString()}
                    </span>
                    {h.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {h.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  {user && (
                    <button
                      onClick={() => {
                        setSelectedHackathon(h);
                        setShowTeamModal(true);
                      }}
                      className="luxury-shimmer-btn px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Form Team</span>
                    </button>
                  )}

                  {h.registration_url && (
                    <a
                      href={h.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-2xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Hackathon Squad Board */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-violet-500" />
                    Campus Squads Looking for Members ({h.teams.length})
                  </h4>
                </div>

                {h.teams.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No teams formed yet. Click "Form Team" to create the first squad for this hackathon!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {h.teams.map((team) => (
                      <div
                        key={team.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                              {team.team_name}
                            </h5>
                            <span className="text-[10px] text-slate-400">
                              {team.members.length}/{team.max_members} members
                            </span>
                          </div>

                          {team.description && (
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {team.description}
                            </p>
                          )}

                          {team.looking_for_roles && (
                            <div className="mt-2 text-[10px]">
                              <span className="text-slate-400 font-medium">Looking for:</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {team.looking_for_roles.split(',').map((r) => (
                                  <span
                                    key={r}
                                    className="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold"
                                  >
                                    {r.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex -space-x-1.5">
                            {team.members.map((m) => (
                              <Avatar
                                key={m.id}
                                src={m.user.avatar_url}
                                name={m.user.full_name}
                                size="sm"
                                isVerified={m.user.verification_status === 'VERIFIED'}
                              />
                            ))}
                          </div>

                          {user && team.leader.id !== user.id && team.members.length < team.max_members && (
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowJoinModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-[11px] shadow-sm transition"
                            >
                              Join Squad
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Team Modal */}
      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title={`Form Team for ${selectedHackathon?.title}`}
        maxWidth="sm"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. NeuralNinjas, HackCatalyst"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Idea / Project Vision
            </label>
            <textarea
              rows={2}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="What track or concept are you targeting?"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Roles You Need (Comma separated)
            </label>
            <input
              type="text"
              value={lookingForRoles}
              onChange={(e) => setLookingForRoles(e.target.value)}
              placeholder="e.g. UI/UX, Backend Dev, Pitch Lead"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Max Team Size
            </label>
            <input
              type="number"
              min={2}
              max={6}
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowTeamModal(false)}
              className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTeam}
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submittingTeam ? 'Creating Squad...' : 'Launch Squad'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Join Squad Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title={`Request to Join ${selectedTeam?.team_name}`}
        maxWidth="sm"
      >
        {joinSuccess ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Application Dispatched!
            </p>
            <p className="text-xs text-slate-500">
              The team leader will review your request and connect via message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleJoinTeam} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Role in the Team *
              </label>
              <input
                type="text"
                required
                value={joinRole}
                onChange={(e) => setJoinRole(e.target.value)}
                placeholder="e.g. Frontend Dev, Pitch Lead, Designer"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Note
              </label>
              <textarea
                rows={3}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Mention your background, projects, or hackathon awards..."
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingJoin}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {submittingJoin ? 'Sending...' : 'Apply to Team'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
