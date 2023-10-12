
import { UsersRepository } from '@application/repositories/users-repository';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userRepository: UsersRepository){}
 
  @WebSocketServer()
  server: Server;
  private studentConnections = new Map<string, Socket>();
  private adminConnections = new Map<string, Socket>();

  async handleConnection(client: Socket, ...args: any[]) {
    const isAdmin = client.handshake.auth.isAdmin
    const userId = client.handshake.auth.userId

    if(isAdmin) {
      this.adminConnections.set(userId, client);
    }else{
      this.studentConnections.set(userId, client);
    }

    if(!userId) return client.disconnect(true)
    const user = await this.userRepository.findById(userId)
   
    this.updateConnectedUsersCount();
  }
  
  handleDisconnect(client: any) {
    
    const {key, isAdmin} = this.getUserIdFromSocket(client);
    if(isAdmin){
      this.adminConnections.delete(key);
    }else{
      this.studentConnections.delete(key);
    }
    this.updateConnectedUsersCount();
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }



  private getUserIdFromSocket(client: Socket){
    for (const [key, val] of this.adminConnections.entries()) {
      if (val === client) {
        return {
          key,
          isAdmin: true
        }
      }
    }

    for (const [key, val] of this.studentConnections.entries()) {
      if (val === client) {
        return {
          key,
          isAdmin: false
        }
      }
    }

    // Se o valor não for encontrado, você pode retornar null ou outra indicação de que não encontrou a chave.
    return null;// Retorna null se não encontrar
  }

  private updateConnectedUsersCount() {
    
    const adminConectionsCount = this.adminConnections.size;
    const studentsConectionsCount = this.studentConnections.size;

    this.server.emit('connectedUsers', {admins: adminConectionsCount, students: studentsConectionsCount});
  }
}