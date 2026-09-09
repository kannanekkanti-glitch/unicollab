import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, MapPin, Clock, Ticket, Plus, 
  CheckCircle2, Building, ExternalLink, Sparkles 
} from 'lucide-react';
import { Event } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Create Event Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech Fest');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priceInfo, setPriceInfo] = useState('Free');
  const [ticketLink, setTicketLink] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', 'Tech Fest', 'Cultural Fest', 'Workshop', 'Sports', 'Seminar'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents(selectedCategory !== 'All' ? selectedCategory : undefined);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleToggleRsvp = async (eventId: number, statusType: 'GOING' | 'INTERESTED' | 'CANCEL') => {
    if (!user) return;
    try {
      await api.toggleRsvp(eventId, statusType);
      await fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createEvent({
        title,
        description,
        category,
        location,
        is_online: isOnline,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        price_info: priceInfo,
        ticket_link: ticketLink || undefined,
        banner_url: bannerUrl || undefined,
      });
      await fetchEvents();
      setShowCreateModal(false);
      // Reset
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-brown-800 to-amber-900 text-white shadow-xl shadow-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Campus Happenings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">College Fests & Official Events</h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl font-normal leading-relaxed">
            Never miss an annual cultural fest, coding symposium, or university concert. Reserve passes directly with verified student privileges.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="luxury-shimmer-btn px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 font-black text-xs shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Campus Event</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                : 'glass-card text-slate-600 dark:text-slate-400 hover:text-orange-600 hover:border-orange-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading campus fests and events...
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card space-y-2">
          <CalendarDays className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No events found</h3>
          <p className="text-xs text-slate-500">Check back soon or publish an event for your club.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="rounded-3xl glass-card glass-card-hover border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Banner image with hover zoom */}
                {ev.banner_url ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={ev.banner_url}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                        {ev.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 relative p-4 flex items-start justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/20">
                      {ev.category}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    {ev.college ? (
                      <Badge type="college" text={ev.college.short_code} />
                    ) : (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                        Inter-College Global Fest
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {ev.price_info}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{new Date(ev.start_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP Action Footer */}
              <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  🎉 {ev.rsvp_count} students attending
                </span>

                <div className="flex items-center gap-2">
                  {ev.ticket_link && (
                    <a
                      href={ev.ticket_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Passes</span>
                    </a>
                  )}

                  {user && (
                    <button
                      onClick={() => handleToggleRsvp(ev.id, ev.has_rsvped ? 'CANCEL' : 'GOING')}
                      className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition flex items-center gap-1.5 ${
                        ev.has_rsvped
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ev.has_rsvped ? 'Attending' : 'RSVP'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Publish a College Fest / Event"
        maxWidth="md"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Robowars Summit 2026, Spring Acoustic Night"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              >
                <option value="Tech Fest">Tech Fest</option>
                <option value="Cultural Fest">Cultural Fest</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price / Pass Info
              </label>
              <input
                type="text"
                value={priceInfo}
                onChange={(e) => setPriceInfo(e.target.value)}
                placeholder="Free or $10 with ID"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Venue / Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium, Convocation Hall, Zoom Link"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline schedule, keynote speakers, competition prizes, and entry eligibility..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Banner Image URL (Optional)
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
            />
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
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
