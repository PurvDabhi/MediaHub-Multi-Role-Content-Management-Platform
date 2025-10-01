import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { fetchContent } from '@/store/slices/contentSlice';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

const ContentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: content, loading } = useSelector((state: RootState) => state.content);
  const { user } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState('all');

  const canCreateContent = user?.role === 'admin' || user?.role === 'editor' || user?.role === 'writer';

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Debug logging
  console.log('Content data:', content);
  console.log('User data:', user);
  console.log('Can create content:', canCreateContent);

  const filteredContent = content.filter(item => {
    if (filter === 'all') {
      return true;
    }
    return item.status === filter;
  });
  


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Content Library
          </h1>
          <p className="text-gray-600 mt-2">Manage and organize your content</p>
        </div>
        <Link 
          to="/content/new" 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 flex items-center group"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Create Content
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-white/20 w-fit">
        {['all', 'draft', 'scheduled', 'published'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === status
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <PencilIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first piece of content</p>
          <Link 
            to="/content/new" 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item: any, index) => {
            console.log('Content item:', item);
            return (
              <div 
                key={item._id || `item-${index}`} 
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {item.authorId?.name || item.author?.name || item.authorName || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : item.status === 'scheduled'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(item.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Link
                    to={`/content/${item._id}`}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center group-hover:scale-105"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentList;