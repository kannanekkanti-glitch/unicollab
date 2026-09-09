import React, { useState } from 'react';
import { 
  Sparkles, Image as ImageIcon, BarChart2, Shield, 
  Send, Plus, Trash2, EyeOff, Building 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { api, uploadFile } from '../../services/api';
import { Post } from '../../types';

interface PostCreatorProps {
  onPostCreated: (newPost: Post) => void;
  onCancel?: () => void;
}

export const PostCreator: React.FC<PostCreatorProps> = ({ onPostCreated, onCancel }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'General' | 'Exams' | 'Fests' | 'Announcements' | 'Lost & Found' | 'Projects'>('General');
  const [isCampusOnly, setIsCampusOnly] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  // Poll state
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Attachment state
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Exams', 'Fests', 'Announcements', 'Lost & Found', 'Projects'];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      setAttachmentUrl(res.url);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const cleanOptions = isPoll ? pollOptions.map(o => o.trim()).filter(Boolean) : undefined;
      const newPost = await api.createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        is_campus_only: isCampusOnly,
        is_anonymous: isAnonymous,
        is_announcement: isAnnouncement,
        attachment_url: attachmentUrl || undefined,
        is_poll: isPoll,
        poll_question: isPoll ? pollQuestion.trim() : undefined,
        poll_options: cleanOptions,
      });

      onPostCreated(newPost);
      // Reset
      setTitle('');
      setContent('');
      setIsPoll(false);
      setAttachmentUrl('');
    } catch (err: any) {
      console.error('Failed to create post', err);
      alert(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          src={isAnonymous ? null : user?.avatar_url}
          name={isAnonymous ? 'Anonymous' : user?.full_name || 'Student'}
          size="md"
          isVerified={!isAnonymous && user?.verification_status === 'VERIFIED'}
        />
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {isAnonymous ? 'Posting Anonymously' : `Create a Post as ${user?.full_name || 'Student'}`}
          </h4>
          <p className="text-[11px] text-slate-400">
            {isCampusOnly ? `Visible only to ${user?.college?.short_code || 'My Campus'}` : 'Broadcasted across all connected colleges'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Title */}
        <input
          type="text"
          placeholder="Title (e.g., Looking for Hackathon Teammates, Exam Prep Notes, Campus Fest Update)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />

        {/* Content */}
        <textarea
          rows={3}
          placeholder="What's on your mind? Share study resources, ask questions, or announce campus projects..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />

        {/* Poll Builder View */}
        {isPoll && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
                Poll Setup
              </span>
              <button
                type="button"
                onClick={() => setIsPoll(false)}
                className="text-[11px] text-rose-500 hover:underline"
              >
                Remove Poll
              </button>
            </div>

            <input
              type="text"
              placeholder="Ask a question..."
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
            />

            <div className="space-y-1.5">
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const copy = [...pollOptions];
                      copy[idx] = e.target.value;
                      setPollOptions(copy);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {pollOptions.length < 6 && (
              <button
                type="button"
                onClick={handleAddPollOption}
                className="text-xs font-semibold text-brand-600 flex items-center gap-1 hover:underline pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Option
              </button>
            )}
          </div>
        )}

        {/* Attachment preview */}
        {attachmentUrl && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 w-fit">
            <img src={attachmentUrl} alt="Attached" className="h-48 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setAttachmentUrl('')}
              className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Controls row */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Category Select & Feature Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none focus:ring-1 focus:ring-brand-500 text-xs font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Poll Trigger */}
            <button
              type="button"
              onClick={() => setIsPoll(!isPoll)}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
                isPoll
                  ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950 dark:border-brand-800'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
              title="Add Poll"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Poll</span>
            </button>

            {/* Image Trigger */}
            <label className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 cursor-pointer flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Photo'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Campus Only Toggle */}
            <button
              type="button"
              onClick={() => setIsCampusOnly(!isCampusOnly)}
              className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                isCampusOnly
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Campus Only</span>
            </button>

            {/* Anonymous Toggle */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                isAnonymous
                  ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Anonymous</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm disabled:opacity-50 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
