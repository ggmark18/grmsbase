import { Component, Input, OnDestroy } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'
import { AuthUser } from '@api-dto/common/auth/dto'

import { SocketService } from '@grms/common/socket/service'
import { AppRootLayout, LayoutConfig, MenuItem } from '@grms/app-root.layout'
import { isAdmin } from '../auth/auth.service'

@Component({
    selector: 'app-header-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./headerfooter.component.scss']
})
export class HeaderMenuComponent implements OnDestroy {
    @Input() set menu(value) {
        this._menu = value
    }
    @Input() set badge(param: { send: string, data: any, receive: string, trigger?: string }) {
        if( param ) this.setupBadgeCount(param)
    }
    _menu: MenuItem
    
    badgeCount = 0
    socketOn = undefined
    socketTrigger = []

    constructor( private layout: AppRootLayout,
                 private socket: SocketService) {
    }

    setupBadgeCount(param) {
        if( this._menu.badge ) {
            this.socketOn = param.recieve
            this.socket.on(this.socketOn, (count) => {
                this.badgeCount = count
            })
            if( param.trigger ) {
                this.socketTrigger = param.trigger
                for( let tg of this.socketTrigger ) {
                    this.socket.emit(tg, param.data)
                }
            }
            this.socket.emit(param.send, param.data)
        }
    }
    ngOnDestroy() {
        if( this.socketOn ) {
            this.socket.removeAllListeners(this.socketOn)
        }
        if( this.socketTrigger ) {
            for( let tg of this.socketTrigger ) {
                this.socket.removeAllListeners(tg)
            }
        }
    }
    
    get badgeHidden() {
        return this.badgeCount <= 0;
    }
}

