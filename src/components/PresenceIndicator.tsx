import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const PresenceIndicator: React.FC = () => {
  const { activeUsers, isConnected } = useSelector((state: RootState) => state.collaboration);

  if (!isConnected || activeUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {activeUsers.length > 3 && (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
            +{activeUsers.length - 3}
          </div>
        )}
      </div>
      <span className="text-sm text-green-700">
        {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''} online
      </span>
    </div>
  );
};

export default PresenceIndicator;