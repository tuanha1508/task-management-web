import { Socket as SocketIOSocket } from 'socket.io';

declare global {
  // Re-export the Socket type to make it available
  export type Socket = SocketIOSocket;
} 