import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthRole } from '@api-dto/common/auth/dto.auth';
import { User, Entities } from '@api-dto/common/users/dto.users';
import { ConfirmDialog, CloseStatus } from '@grms/common/dialog/confirm.dialog';
import { SocketService } from '@grms/common/base/socket.service';
import { UsersService } from './users.service';

import { UsersDialog } from './users.dialog';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    
    users = [];
    users_datasource = null;
    roleoptions = [];

    usersDisplayedColumns = ['loginid','name', 'email', 'role', 'status', 'lastPasswordUpdated', 'function'];

    subscriptions: Subscription;
    
    constructor(private service: UsersService,
		        private socket: SocketService,
		        private dialog: MatDialog ) {
        Object.entries(AuthRole).forEach(([key, value]) => {
            this.roleoptions.push({display:value, value:value});
        })
    }

    ngOnInit() {
	    this.subscriptions = this.service.allUsers().subscribe(users => {
	        this.users = users;
	        this.users_datasource = new MatTableDataSource(this.users);
	        this.socket.syncUpdates(Entities.User, this.users, ()=>{this.updateDatasource();});
	        this.users_datasource.paginator = this.paginator;
	    });
    }
    ngOnDestroy() {
        this.socket.unsyncUpdates(Entities.User);
        this.subscriptions.unsubscribe();
    }

    updateDatasource() {
        this.users_datasource.data = this.users;
    }

    applyFilter(filterValue: string) {
	    this.users_datasource.filter = filterValue.trim().toLowerCase();
    }

    openUserEditor(element=undefined) {
	    this.dialog.open(UsersDialog, {
	        data: { model:element, roles:this.roleoptions },
            width:  '300px'
	    });
    }

    deleteConfirm(element) {
        let dialogconfig = {
            icon: {icon:'fas fa-trash-alt'},
            title: $localize`Confirm to Delete User`,
            content: `<strong>${element.name}</strong><br><span class="test-muted">${element.email}</span>`,
            okButtonClass: "btn btn-delete btn-sm",
            cancelButton: true
        }

	    let dialogRef = this.dialog.open(ConfirmDialog, {
            data: dialogconfig,
            width: "300px"
	    });
        // No need to unsubscribe from afterClosed() as it auto completes itself.
        dialogRef.afterClosed().pipe(switchMap( ret =>{
            if( ret == CloseStatus.OK ) {
                return this.service.deleteUser(element);
            } else {
                return NEVER;
            }
        })).subscribe();
    }

}

