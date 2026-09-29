import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
  }
  if (import.meta.env.PROD) {
    return 'https://exam-proctar.onrender.com';
  }
  return 'http://localhost:5002';
};

const SOCKET_URL = getSocketUrl();

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};