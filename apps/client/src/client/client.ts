import { PlayerActionMessage, ActorUpdateMessage, ActorDeleteMessage } from '@libs/shared';
import { io, Socket } from 'socket.io-client';

export class Client {
  private socket: Socket;

  id?: string;

  constructor(url?: string) {
    if (url === undefined) {
      this.socket = io();
    } else {
      this.socket = io(url);
    }
  }

  onConnect(callback: (id: string) => void) {
    this.socket.on('connect', () => {
      const id = this.socket.id;
      if (!id) {
        throw new Error('Socket ID is undefined on connect');
      }
      this.id = id;
      callback(id);
    });
  }

  onDisconnect(callback: () => void) {
    this.socket.on('disconnect', callback);
  }

  sendPlayerAction(message: PlayerActionMessage) {
    this.socket.emit('update', message);
  }

  onUpdate(callback: (message: ActorUpdateMessage) => void) {
    this.socket.on('update', callback);
  }

  onDelete(callback: (message: ActorDeleteMessage) => void) {
    this.socket.on('delete', callback);
  }
}
