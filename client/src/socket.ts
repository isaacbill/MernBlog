import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket && socket.connected) return socket;
  socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
  });
  return socket;
};

export const getSocket = (): Socket | null => socket;
