import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection,  EntitySubscriberInterface,EventSubscriber,InsertEvent,UpdateEvent,RemoveEvent} from 'typeorm';

import { Server } from 'socket.io';

import { PSAuthUser } from './entities/authUsers.entity';

@WebSocketGateway({path: '/socket.io-client'})
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<PSAuthUser> {

    @WebSocketServer()
    server: Server;

    constructor(
        @InjectConnection('sqldb')
        private connection: Connection ) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return PSAuthUser;
    }

    afterInsert(event: InsertEvent<PSAuthUser>) {
        const { salt, password, ...user } = event.entity;
        this.server.emit('User:create', user)
    }
    
    afterRemove(event: RemoveEvent<PSAuthUser>) {
        const id = event.entityId;
        this.server.emit('User:remove', {_id: id})
    }

    afterUpdate(event: UpdateEvent<PSAuthUser>) {
        const { salt, password, ...user } = event.entity;
        this.server.emit('User:update', user)
    }
}
