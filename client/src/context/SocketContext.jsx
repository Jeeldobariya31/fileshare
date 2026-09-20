import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

// Backend WebSocket URL
const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    // Initialize socket
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected');
    });

    // Device events
    socket.on('device:connected', (data) => {
      setConnectedCount(data.totalConnected || 0);
      setLatestEvent({ type: 'device:connected', data });
    });

    socket.on('device:disconnected', (data) => {
      setConnectedCount(data.totalConnected || 0);
      setLatestEvent({ type: 'device:disconnected', data });
    });

    // File events — show toast notifications
    socket.on('file:uploaded', (file) => {
      setLatestEvent({ type: 'file:uploaded', data: file });
      // Only show if it's NOT our own upload (we handle that locally)
    });

    socket.on('file:deleted', (data) => {
      setLatestEvent({ type: 'file:deleted', data });
    });

    socket.on('file:renamed', (file) => {
      setLatestEvent({ type: 'file:renamed', data: file });
    });

    // Download events
    socket.on('download:start', (data) => {
      setLatestEvent({ type: 'download:start', data });
    });

    socket.on('download:complete', (data) => {
      setLatestEvent({ type: 'download:complete', data });
    });

    // Server welcome
    socket.on('server:welcome', (data) => {
      setConnectedCount(data.totalDevices || 1);
    });

    // Start heartbeat
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat');
      }
    }, 30000);

    // Ping measurement
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        const start = Date.now();
        socket.emit('ping:send');
        socket.once('ping:response', () => {
          const ping = Date.now() - start;
          socket.emit('ping:result', { ping });
        });
      }
    }, 10000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, []);

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      connectedCount,
      latestEvent,
      emit,
      on,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
