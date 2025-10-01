import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
  }

  connect(token: string) {
    this.socket = io(this.url, {
      auth: { token }
    });
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave-room', roomId);
  }

  sendContentUpdate(contentId: string, data: any) {
    this.socket?.emit('content-update', { contentId, data });
  }

  onContentUpdate(callback: (data: any) => void) {
    this.socket?.on('content-update', callback);
  }

  onUserPresence(callback: (users: any[]) => void) {
    this.socket?.on('user-presence', callback);
  }
}

export const wsService = new WebSocketService();