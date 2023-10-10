
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private userConnections = new Map<string, string>();

  handleConnection(client: Socket) {
    // const userId = getUserIdFromSocket(client); // Implemente esta função para obter o ID do usuário
    // this.userConnections.set(userId, client.id);

    // Atualize a contagem de usuários únicos
    // this.updateConnectedUsersCount();
  }

  handleDisconnect(client: Socket) {
    // const userId = getUserIdFromSocket(client);
    // this.userConnections.delete(userId);

    // Atualize a contagem de usuários únicos
    // this.updateConnectedUsersCount();
  }

  private updateConnectedUsersCount() {
    const uniqueUserCount = new Set(this.userConnections.keys()).size;
    // this.server.emit('connectedUsers', uniqueUserCount);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }
}