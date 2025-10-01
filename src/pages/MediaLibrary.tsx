import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { RootState, AppDispatch } from '@/store';
import { fetchMedia, uploadMedia } from '@/store/slices/mediaSlice';
import { PhotoIcon, DocumentIcon, VideoCameraIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MediaLibrary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files: media, loading } = useSelector((state: RootState) => state.media);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        await dispatch(uploadMedia(file)).unwrap();
      }
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`);
    } catch {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const filteredMedia = media.filter(file => {
    if (filter === 'all') {
      return true;
    }
    return file.type === filter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return PhotoIcon;
      case 'video':
        return VideoCameraIcon;
      default:
        return DocumentIcon;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <PhotoIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Media Library
              </h1>
              <p className="text-gray-600 text-lg mt-1">Manage your images, videos, and documents</p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`bg-white/70 backdrop-blur-xl rounded-3xl p-12 border-2 border-dashed border-white/40 text-center cursor-pointer transition-all duration-300 shadow-2xl ${
            isDragActive
              ? 'border-orange-500 bg-orange-50/50 scale-105'
              : 'hover:border-orange-400 hover:bg-white/80 hover:scale-102'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CloudArrowUpIcon className="w-10 h-10 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-3">
            {isDragActive ? '🎯 Drop files here' : '✨ Upload media files'}
          </p>
          <p className="text-gray-600 text-lg">
            Drag and drop files here, or click to select files
          </p>
          {uploading && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-orange-600 font-semibold">Uploading...</p>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex space-x-3">
            {[
              { type: 'all', icon: '📁', label: 'All Files' },
              { type: 'image', icon: '🖼️', label: 'Images' },
              { type: 'video', icon: '🎥', label: 'Videos' },
              { type: 'document', icon: '📄', label: 'Documents' }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  filter === type
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:scale-105 shadow-md'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 border-4 border-orange-600/30 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading media files...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <PhotoIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-semibold mb-2">No media files found</p>
              <p className="text-gray-400">Upload some files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-8">
              {filteredMedia.map((file, index) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div key={file.id || `file-${index}`} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div 
                      className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => setSelectedMedia(file)}
                    >
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : file.type === 'video' ? (
                        <div className="relative w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <VideoCameraIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {selectedMedia.type === 'image' ? (
              <>
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-2xl">
                  <h3 className="text-white font-semibold text-lg mb-1">{selectedMedia.name}</h3>
                  <p className="text-white/80 text-sm">
                    {formatFileSize(selectedMedia.size)} • {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            ) : selectedMedia.type === 'video' ? (
              <div className="flex flex-col">
                <video
                  src={selectedMedia.url}
                  controls
                  preload="metadata"
                  className="w-full object-contain rounded-t-2xl"
                  style={{ maxHeight: '70vh' }}
                />
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-b-2xl">
                  <h3 className="text-white font-semibold text-lg mb-1">{selectedMedia.name}</h3>
                  <p className="text-white/80 text-sm">
                    {formatFileSize(selectedMedia.size)} • {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : selectedMedia.type === 'document' ? (
              <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-12">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <DocumentIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">{selectedMedia.name}</h3>
                <p className="text-white/80 text-sm mb-6">
                  {formatFileSize(selectedMedia.size)} • {new Date(selectedMedia.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={selectedMedia.url}
                  download={selectedMedia.name}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Download Document
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;