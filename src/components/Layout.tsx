import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '@/store';
import { clearCredentials } from '@/store/slices/authSlice';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  UserGroupIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Debug logging for Layout
  console.log('Layout user data:', user);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Content', href: '/content', icon: DocumentTextIcon },
    { name: 'Media', href: '/media', icon: PhotoIcon },
    ...(user?.role === 'admin' ? [{ name: 'Users', href: '/users', icon: UserGroupIcon }] : []),
  ];

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MediaHub
            </h1>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="absolute bottom-0 w-72 p-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || 'Loading...'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;