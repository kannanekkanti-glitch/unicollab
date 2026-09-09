import React, { useState, useEffect } from 'react';
import { 
  Flame, Building, Globe, Megaphone, User, 
  Sparkles, Filter, Plus, RefreshCw 
} from 'lucide-react';
import { Post } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/feed/PostCard';
import { PostCreator } from '../components/feed/PostCreator';
import { Badge } from '../components/common/Badge';

export const HomeFeedPage: React.FC = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState<'all' | 'campus' | 'trending' | 'announcements' | 'mine'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreator, setShowCreator] = useState(false);

  const categories = ['All', 'Projects', 'Exams', 'Fests', 'Announcements', 'Lost & Found', 'General'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts(
        feedType,
        selectedCategory !== 'All' ? selectedCategory : undefined,
        feedType === 'campus' ? user?.college_id : undefined
      );
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, selectedCategory, user]);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setShowCreator(false);
  };

  return (
    <div className="space-y-6">
      {/* Feed Tabs Bar */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setFeedType('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              feedType === 'all'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Campuses</span>
          </button>

          <button
            onClick={() => setFeedType('campus')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              feedType === 'campus'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{user?.college?.short_code || 'My Campus'}</span>
          </button>

          <button
            onClick={() => setFeedType('trending')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              feedType === 'trending'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setFeedType('announcements')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              feedType === 'announcements'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-brand-500" />
            <span>Official Alerts</span>
          </button>
        </div>

        <button
          onClick={fetchPosts}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1 pl-1">
          <Filter className="w-3 h-3" /> Topics:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium text-xs ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post Creator Prompt / Widget */}
      {user && (
        <>
          {showCreator ? (
            <PostCreator
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreator(false)}
            />
          ) : (
            <div
              onClick={() => setShowCreator(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-bold text-xs">
                  {user.full_name[0]}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Have an announcement, exam question, or project idea? Click to post...
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-2 bg-slate-100 dark:bg-slate-800/60 rounded w-1/6" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No posts found in this feed
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first student to break the ice! Share project updates, exam notes, or campus fest news.
          </p>
          {user && (
            <button
              onClick={() => setShowCreator(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition"
            >
              Start a Conversation
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={(id) => setPosts(posts.filter(p => p.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};
