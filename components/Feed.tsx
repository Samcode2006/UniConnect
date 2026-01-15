import React, { useState } from 'react';
import { Post, PostCategory } from '../types';
import { Heart, MessageSquare, Share2, MoreHorizontal, Calendar, Megaphone, BadgeCheck, MessageCircle, HelpCircle } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  showHeader?: boolean;
}

const Feed: React.FC<FeedProps> = ({ posts, showHeader = true }) => {
  const [filter, setFilter] = useState<PostCategory | 'All'>('All');

  const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const getCategoryIcon = (cat: PostCategory) => {
    switch (cat) {
        case PostCategory.CLUB_EVENT: return <Calendar size={12} />;
        case PostCategory.CONFESSION: return <MessageCircle size={12} />;
        case PostCategory.QUESTION: return <HelpCircle size={12} />;
        default: return <BadgeCheck size={12} />;
    }
  };

  const getCategoryColor = (cat: PostCategory) => {
    switch (cat) {
        case PostCategory.CLUB_EVENT: return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30';
        case PostCategory.CONFESSION: return 'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30';
        case PostCategory.QUESTION: return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
        default: return 'text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className={`pb-24 ${showHeader ? 'pt-4 md:pt-8 md:px-8 max-w-2xl mx-auto min-h-screen' : ''}`}>
      
      {/* Header / Filter */}
      {showHeader && (
        <div className="px-4 mb-6 sticky top-0 md:static z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Buzz</h1>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['All', ...Object.values(PostCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as PostCategory | 'All')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-academic-primary text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className={`space-y-4 ${showHeader ? 'px-4' : ''}`}>
        {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                
                {/* Author Header */}
                <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                    <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                    />
                    <div>
                    <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                        {post.isOfficial && <BadgeCheck size={14} className="text-blue-500 fill-blue-50 dark:fill-transparent" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreHorizontal size={20} />
                </button>
                </div>

                {/* Content */}
                <div className="mb-3">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {post.content}
                </p>
                </div>

                {/* Image Attachment */}
                {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-80" loading="lazy" />
                </div>
                )}

                {/* Category Badge */}
                <div className="mb-4">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(post.category)}`}>
                        {getCategoryIcon(post.category)} {post.category}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-3">
                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30">
                    <Heart size={20} />
                    </div>
                    <span className="text-sm font-medium">{post.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                    <MessageSquare size={20} />
                    </div>
                    <span className="text-sm font-medium">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                    <Share2 size={20} />
                    </div>
                </button>
                </div>

            </div>
            ))
        ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500 text-sm">No posts to display.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Feed;