import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { fetchContent } from '@/store/slices/contentSlice';
import { fetchMedia } from '@/store/slices/mediaSlice';
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  PlusIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: content } = useSelector((state: RootState) => state.content);
  const { files: media } = useSelector((state: RootState) => state.media);

  useEffect(() => {
    dispatch(fetchContent());
    dispatch(fetchMedia());
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Content',
      value: content.length,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Published',
      value: content.filter(c => c.status === 'published').length,
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Media Files',
      value: media.length,
      icon: PhotoIcon,
      color: 'bg-purple-500',
    },
  ];

  const recentContent = content.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-gray-600 text-lg mt-2">Here's what's happening with your content today.</p>
              </div>
            </div>
            {(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'writer') && (
              <Link 
                to="/content/new" 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <PlusIcon className="w-6 h-6" />
                <span>New Content</span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const gradients = [
              'from-orange-500 to-red-500',
              'from-amber-500 to-orange-600', 
              'from-red-500 to-pink-500'
            ];
            return (
              <div key={stat.name} className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.name}</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Content */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Recent Content</h2>
            </div>
          </div>
          <div className="divide-y divide-white/20">
            {recentContent.length > 0 ? recentContent.map((item, index) => (
              <div key={item.id || `content-${index}`} className="p-6 hover:bg-white/50 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${
                    item.status === 'published' 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                      : item.status === 'scheduled'
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                  }`}>
                    {item.status === 'published' ? '🚀 Published' : 
                     item.status === 'scheduled' ? '⏰ Scheduled' : 
                     '📝 Draft'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No content available</p>
                <p className="text-gray-400 text-sm mt-1">Create your first piece of content to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;