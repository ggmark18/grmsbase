import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection,  EntitySubscriberInterface,EventSubscriber,InsertEvent,UpdateEvent,RemoveEvent} from 'typeorm';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
@EventSubscriber()
export class WebSocketSubscriber<T> implements EntitySubscriberInterface<T> {

    @WebSocketServer()
    server: Server;

    constructor(
        @InjectConnection('sqldb')
        private connection: Connection ) {
        connection.subscribers.push(this);

    }

    get entityName() { return undefined; }
    entityClass() { return undefined; }
    sliceEntity(entity) { return entity; }

    listenTo() {
        return this.entityClass();
    }

    afterInsert(event: InsertEvent<T>) {
        const target = this.sliceEntity(event.entity);
        this.server.emit(`${this.entityName}:create`, target)
    }
    
    afterRemove(event: RemoveEvent<T>) {
        const id = event.entityId;
        this.server.emit(`${this.entityName}:remove`, {_id: id});
    }

    afterUpdate(event: UpdateEvent<T>) {
        const target = this.sliceEntity(event.entity);
        this.server.emit(`${this.entityName}:update`, target);
    }
}

