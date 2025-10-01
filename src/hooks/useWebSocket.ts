import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { isConnected } = useSelector((state: RootState) => state.collaboration);

  useEffect(() => {
    // WebSocket connection disabled until Socket.IO server is set up
    // if (token && !isConnected) {
    //   const socket = wsService.connect(token);
    //   
    //   socket.on('connect', () => {
    //     dispatch(setConnected(true));
    //   });

    //   socket.on('disconnect', () => {
    //     dispatch(setConnected(false));
    //   });

    //   wsService.onUserPresence((users) => {
    //     dispatch(setActiveUsers(users));
    //   });

    //   return () => {
    //     wsService.disconnect();
    //     dispatch(setConnected(false));
    //   };
    // }
  }, [token, isConnected, dispatch]);

  return { isConnected };
};