import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway( { cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

//    @SubscribeMessage('msgToServer')
//    handleMessage(client: Socket, payload: string): void {
//        this.server.emit('msgToClient', payload);
//    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        client.on('login', req => {
            this.logger.log(`User LOGIN: ${req.userID}`);
            client.join('USERID'+req.userID);
        });

        client.on('logout', req => {
            this.logger.log(`User LOGOUT: ${req.userID}`);
            client.leave('USERID'+req.userID);
        });
        
    }
}
