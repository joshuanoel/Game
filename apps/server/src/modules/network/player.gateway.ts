import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';
import { ActorDeleteMessage, ActorState, ActorUpdateMessage, Player, PlayerAction, PlayerActionMessage } from '@libs/shared';

@WebSocketGateway({ cors: true })
export class PlayerGateway {
  @WebSocketServer() server!: Server;

  clients: Record<string, Socket> = {};

  constructor(private gameService: GameService) {
    // // High-frequency updates
    // setInterval(() => {
    //   const players = this.gameService.getPlayers();
    //   const message: ActorUpdateMessage = {
    //     timestamp: Date.now(),
    //     actors: players.map((player): ActorState => ({
    //       id: player.id,
    //       type: 'player',
    //       position: player.position,
    //       velocity: player.velocity,
    //       rotation: player.rotation,
    //       size: player.size,
    //     })),
    //   };
    //   this.server.emit('update', message);
    // }, 1000 / 60);

    // Low-frequency updates
    setInterval(() => {
      const actors = this.gameService.getActors();
      const message: ActorUpdateMessage = {
        timestamp: Date.now(),
        actors: actors.map((actor): ActorState => ({
          id: actor.id,
          type: actor instanceof Player ? 'player' : 'cube',  
          position: actor.position,
          velocity: actor.velocity,
          rotation: actor.rotation ?? [0, 0, 0],
          size: actor.size ?? [1, 1, 1],
        })),
      };
      this.server.emit('update', message);
    }, 1000 / 60);
  }

  handleConnection(client: Socket) {
    this.gameService.addPlayer(client.id);
    this.clients[client.id] = client;

    const actors = this.gameService.getActors();
    const message: ActorUpdateMessage = {
      timestamp: Date.now(),
      actors: actors.map((actor): ActorState => ({
        id: actor.id,
        type: actor instanceof Player ? 'player' : 'cube',
        position: actor.position,
        velocity: actor.velocity,
        rotation: actor.rotation ?? [0, 0, 0],
        size: actor.size ?? [1, 1, 1],
      })),
    };
    client.emit('update', message);
  }

  handleDisconnect(client: Socket) {
    this.gameService.removePlayer(client.id);
    delete this.clients[client.id];

    const message: ActorDeleteMessage = {
      timestamp: Date.now(),
      id: client.id,
    };
    this.server.emit('delete', message);
  }

  @SubscribeMessage('update')
  handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PlayerActionMessage,
  ) {
    this.gameService.updatePlayer(client.id, data.actions);
  }
}
