import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { io } from "socket.io-client";
import * as _ from 'lodash';

export declare const enum IMEvent {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted"
}

export class SocketService {

    private socket;
    private static url;

    constructor () {
        this.socket = io(environment.socket_url);
    }

    emit(eventName, data) {
        return this.socket.emit.apply(this.socket, [eventName, data]);
    }

    syncUpdates(modelName, array, callback=null, topadd=false) {
        var cb = callback || function(){}; // If there is no callback, exit function no return value. same as angular.noop?

        /**
         * Syncs item creation/updates on 'model:create'
         */
        this.socket.on(`${modelName}:create`, (item) => {
	        if( array instanceof Map ) {
		        array.set(item._id, item);
	        } else {
		        (topadd)?array.unshift(item):array.push(item);
	        }
            cb(IMEvent.CREATED, item, array);
        });
        /**
         * Syncs item creation/updates on 'model:update'
         */
        this.socket.on(`${modelName}:update`, (item) => {
	        if( array instanceof Map ) {
		        array.delete(item._id);
		        array.set(item._id, item);
	        } else {
		        var oldItem = _.find(array, {
                    _id: item._id
		        });
		        var index = array.indexOf(oldItem);
		        array.splice(index, 1, item);
	        }
            cb(IMEvent.UPDATED, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        this.socket.on(modelName + ':remove', (item) => {
	        if( array instanceof Map ) {
		        array.delete(item._id);
	        } else {
		        _.remove(array, {
                    _id: item._id
		        });
	        }
            cb(IMEvent.DELETED, item, array);
        });
    }

    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates(modelName) {
        this.socket.removeAllListeners(modelName + ':create');
        this.socket.removeAllListeners(modelName + ':update');
        this.socket.removeAllListeners(modelName + ':remove');
    }

    on(event, fn) {
        this.socket.on(event, fn);
    }

    removeAllListeners(event) {
        this.socket.removeAllListeners(event);
    }
}
