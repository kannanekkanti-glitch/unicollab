import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowBigUp, ArrowBigDown, MessageCircle, Share2, 
  Flag, MoreHorizontal, CheckCircle2, ShieldCheck, 
  Send, Sparkles 
} from 'lucide-react';
import { Post, Comment } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
  onPostDeleted?: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostUpdated,
  onPostDeleted,
}) => {
  const { user } = useAuth();
  const [currentVote, setCurrentVote] = useState<number>(post.user_vote);
  const [upvotes, setUpvotes] = useState<number>(post.upvotes_count);
  const [downvotes, setDownvotes] = useState<number>(post.downvotes_count);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [pollOptions, setPollOptions] = useState(post.poll_options || []);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleVote = async (voteType: number) => {
    if (!user) return;
    const newVote = currentVote === voteType ? 0 : voteType;

    // Optimistic update
    let newUp = upvotes;
    let newDown = downvotes;
    if (currentVote === 1) newUp--;
    if (currentVote === -1) newDown--;
    if (newVote === 1) newUp++;
    if (newVote === -1) newDown++;

    setCurrentVote(newVote);
    setUpvotes(newUp);
    setDownvotes(newDown);

    try {
      await api.votePost(post.id, newVote);
    } catch (err) {
      // Revert on error
      setCurrentVote(post.user_vote);
      setUpvotes(post.upvotes_count);
      setDownvotes(post.downvotes_count);
    }
  };

  const handlePollVote = async (optionId: number) => {
    if (!user) return;
    try {
      await api.votePoll(post.id, optionId);
      // Update poll option counts locally
      setPollOptions(prev =>
        prev.map(opt => ({
          ...opt,
          has_voted: opt.id === optionId,
          vote_count: opt.id === optionId ? opt.vote_count + 1 : opt.has_voted ? opt.vote_count - 1 : opt.vote_count,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      try {
        const data = await api.getComments(post.id);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments', err);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(post.id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentsCount(prev => prev + 1);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.reportContent({
        target_type: 'POST',
        target_id: post.id,
        reason: reportReason,
        details: reportDetails,
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPollVotes = pollOptions.reduce((acc, opt) => acc + opt.vote_count, 0);

  return (
    <article className="p-5 sm:p-6 rounded-3xl glass-card transition-all duration-300 hover:shadow-xl hover:border-brand-500/30 relative overflow-hidden group">
      {/* Subtle top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {post.is_anonymous ? (
            <Avatar name="Anonymous Student" size="md" />
          ) : (
            <Link to={post.author ? `/profile/${post.author.id}` : '#'}>
              <Avatar
                src={post.author?.avatar_url}
                name={post.author?.full_name || 'Student'}
                size="md"
                isVerified={post.author?.verification_status === 'VERIFIED'}
              />
            </Link>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {post.is_anonymous ? (
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Anonymous Student
                </span>
              ) : (
                <Link
                  to={post.author ? `/profile/${post.author.id}` : '#'}
                  className="font-bold text-xs text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  {post.author?.full_name}
                </Link>
              )}

              {post.author?.verification_status === 'VERIFIED' && !post.is_anonymous && (
                <span className="text-emerald-500 verified-badge-glow" title="Verified Campus Student">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}

              {post.college && (
                <Badge type="college" text={post.college.short_code} size="sm" />
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
              <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              {post.is_campus_only && (
                <>
                  <span>•</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5">
                    🔒 Campus Only
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Badge & Menu */}
        <div className="flex items-center gap-2">
          <Badge type="category" text={post.category} size="sm" />
          <button
            onClick={() => setShowReportModal(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Report Post"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Attachment image */}
        {post.attachment_url && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-white/10 max-h-96 shadow-md transition-transform duration-300 hover:scale-[1.01]">
            <img
              src={post.attachment_url}
              alt="Post attachment"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Interactive Poll with Animated Gradient Bars */}
        {post.is_poll && pollOptions.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/10 space-y-3">
            {post.poll_question && (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>📊</span>
                <span>{post.poll_question}</span>
              </p>
            )}

            <div className="space-y-2">
              {pollOptions.map((opt) => {
                const percentage = totalPollVotes > 0 ? Math.round((opt.vote_count / totalPollVotes) * 100) : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePollVote(opt.id)}
                    className={`relative w-full text-left p-3 rounded-xl border text-xs font-semibold overflow-hidden transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      opt.has_voted
                        ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-sm'
                        : 'border-slate-200/70 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 hover:border-brand-400'
                    }`}
                  >
                    {/* Animated Progress bar background */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500/25 to-indigo-500/25 dark:from-brand-500/35 dark:to-indigo-500/35 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="relative z-10 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      {opt.has_voted && <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                      {opt.text}
                    </span>
                    <span className="relative z-10 font-bold text-brand-700 dark:text-brand-300">
                      {percentage}% <span className="text-[10px] text-slate-400 font-normal">({opt.vote_count})</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-medium text-slate-400 text-right">{totalPollVotes} total votes</p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          {/* Upvote / Downvote control with spring tactile bounce */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/80 rounded-full p-1 shadow-inner">
            <button
              onClick={() => handleVote(1)}
              className={`p-1.5 px-2.5 rounded-full transition-all duration-200 active:scale-90 flex items-center gap-1.5 ${
                currentVote === 1
                  ? 'text-brand-600 bg-white dark:bg-slate-900 shadow-md font-bold scale-105'
                  : 'hover:text-brand-600 hover:scale-105'
              }`}
              title="Upvote"
            >
              <ArrowBigUp className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold">{upvotes}</span>
            </button>

            <button
              onClick={() => handleVote(-1)}
              className={`p-1.5 rounded-full transition-all duration-200 active:scale-90 ${
                currentVote === -1
                  ? 'text-rose-600 bg-white dark:bg-slate-900 shadow-md font-bold scale-105'
                  : 'hover:text-rose-600 hover:scale-105'
              }`}
              title="Downvote"
            >
              <ArrowBigDown className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Comment Trigger */}
          <button
            onClick={loadComments}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105 text-slate-600 dark:text-slate-300 font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount} comments</span>
          </button>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText?.(window.location.origin + `/posts/${post.id}`);
            alert('Link copied to clipboard!');
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110"
          title="Share post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a constructive student comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2.5 pt-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                <Avatar
                  src={comment.author?.avatar_url}
                  name={comment.author?.full_name || 'Student'}
                  size="sm"
                  isVerified={comment.author?.verification_status === 'VERIFIED'}
                />
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {comment.author?.full_name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Content to Campus Moderation"
        maxWidth="sm"
      >
        {reportSubmitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Report Submitted
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for keeping our college network safe and trusted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              >
                <option value="Spam">Spam or unwanted advertising</option>
                <option value="Harassment">Harassment or bullying</option>
                <option value="Hate Speech">Hate speech or discrimination</option>
                <option value="Misinformation">Academic cheating or false info</option>
                <option value="Other">Other violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Details (Optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
                placeholder="Provide additional context for student moderators..."
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </Modal>
    </article>
  );
};
