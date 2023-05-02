import { DefaultEventsMap } from '@socket.io/component-emitter';
import {io, Socket} from 'socket.io-client';

class SocketioService {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
  constructor() {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io('http://localhost:3000');
    console.log('Socket initialized');
  }

  subscribeToMessages(cb: (err: any, data: any) => void) {
    if (!this.socket) return(true);
    this.socket.on('message', msg => {
      return cb(null, msg);
    });
  }

  joinRoom(roomName: string, userId: number) {
    console.log('Joining room: ' + roomName);
    if (this.socket) this.socket.emit('join', roomName, userId);
  }

  sendMessage(message: { sentBy: number, text: string, time: string }, roomName: string, cb: (err: any, data: any) => void) {
    console.log('Sending message to room: ' + roomName);
    if (this.socket) this.socket.emit('message', { message, roomName }, cb);
  }

  disconnect() {
    console.log('Disconnecting socket');
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
