import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import QuillEditor from '@/components/QuillEditor';
import { RootState, AppDispatch } from '@/store';
import { createContent, updateContent, fetchContent } from '@/store/slices/contentSlice';
import { Content } from '@/types';
import toast from 'react-hot-toast';

const ContentEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: content } = useSelector((state: RootState) => state.content);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Fetch content if not already loaded
  useEffect(() => {
    if (content.length === 0) {
      dispatch(fetchContent());
    }
  }, [dispatch, content.length]);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    status: 'draft' as Content['status'],
    publishDate: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(id);
  const currentContent = content.find(c => (c as any)._id === id);
  
  console.log('Edit mode - ID from URL:', id);
  console.log('Available content:', content);
  console.log('Found content:', currentContent);

  useEffect(() => {
    if (isEditing && id && content.length > 0) {
      const foundContent = content.find(c => (c as any)._id === id);
      if (foundContent) {
        console.log('Loading content for editing:', foundContent);
        setFormData({
          title: foundContent.title,
          body: foundContent.body,
          status: foundContent.status,
          publishDate: foundContent.publishDate ? new Date(foundContent.publishDate).toISOString().slice(0, 16) : '',
          tags: foundContent.tags || [],
        });
      } else {
        console.log('Content not found for ID:', id);
      }
    }
  }, [isEditing, id, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        await dispatch(updateContent({ id: id, data: formData })).unwrap();
        toast.success('Content updated successfully!');
        navigate('/content');
      } else {
        await dispatch(createContent(formData)).unwrap();
        toast.success('Content created successfully!');
        navigate('/content');
      }
    } catch {
      toast.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const canPublish = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {isEditing ? '✏️' : '✨'}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEditing ? 'Edit Content' : 'Create New Content'}
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                {isEditing ? 'Update your content' : 'Share your ideas with the world'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Title</h2>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xl font-medium placeholder-gray-400 shadow-inner"
              placeholder="Enter your content title..."
              required
            />
          </div>

          {/* Content Editor Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">📝</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Content</h2>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden shadow-inner">
              <QuillEditor
                value={formData.body}
                onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
                className="h-80"
              />
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚙️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    status: e.target.value as Content['status'] 
                  }))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium shadow-inner"
                >
                  <option value="draft">📝 Draft</option>
                  {canPublish && (
                    <>
                      <option value="scheduled">⏰ Scheduled</option>
                      <option value="published">🚀 Published</option>
                    </>
                  )}
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium shadow-inner"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">#</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Tags</h2>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 border border-blue-200 shadow-sm"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-red-500 font-bold transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium placeholder-gray-400 shadow-inner"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/content')}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold border border-white/30 hover:bg-white/90 hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>{isEditing ? '💾 Update Content' : '✨ Create Content'}</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditor;