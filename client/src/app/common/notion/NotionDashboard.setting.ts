import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner"

import { NotionDashboard, NotionPostControl, NotionPage } from '@api-dto/common/notion/dto'
import { NotionServiceBase } from './'

@Component({
    selector: 'notion-dashboard-setting',
    templateUrl: './NotionDashboard.setting.html',
    styleUrls: ['../profile/profile.scss']
})
export class NotionDashboardSetting {
    @Input() set dashboard( value: NotionDashboard ) {
        this._dashboard = value
        this.setupDashboard()
    }
    @Input() set service( value: NotionServiceBase ) {
        this.notionService = value
    }
    @Output() event = new EventEmitter<NotionDashboard>();

    _dashboard: NotionDashboard = undefined;
    notionForm: FormGroup;
    status = null;
    spinnerMessage;

    notionService: NotionServiceBase

    constructor(private fb: FormBuilder,
                private spinner: NgxSpinnerService,
                private dialog: MatDialog) {
        this.notionForm = this.fb.group({
            _id: [''],
            title: [''],
            secret: [''],
            pageid: [''],
        });
    }

    setupDashboard() {
        this.notionForm.patchValue(this._dashboard);
        this.checkStatus();
    }

    eventEmit(arg) { this.event.emit(arg); }

    save() {
        this._dashboard.secret = this.notionForm.get('secret').value;
        this._dashboard.pageid = this.notionForm.get('pageid').value;
        this._dashboard.title = this.notionForm.get('title').value;
        this.eventEmit(this._dashboard);
    }

    cancel() {
        this.eventEmit(null);
    }

    connectCheck() {
        this.status = null;
        this.spinnerMessage = 'Checking...';
        this.spinner.show();
        this.notionService.connectCheck(this.notionForm.value).subscribe( res => {
            this.spinner.hide();
            if( res.status == 400 ) {
                this.status = "Page ID が不正です。";
            } else if( res.status == 401 ) {
                this.status = "Notionコネクト が不正です。";
            } else {
                this.status = "OK";
                let title = res.properties?.title?.title[0]?.plain_text;
                if( title ) {
                    this.notionForm.get('title').setValue(title);
                    this.notionForm.get('pageid').setValue(res.id);
                }
            }
        });
    }
    
    checkStatus() {
        this.status = null;
        if( ( this._dashboard?.pageid?.match( new RegExp( "-", "g" ) ) || [] ).length == 4  ){
            this.status = 'OK';
        }
    }

    get hasStatusError() {
        return this.status && this.status != 'OK';
    }
    get statusIcon() {
        let icon;
        if( this.status ) {
            if ( this.status == 'OK' ) {
                icon = "fas fa-check";
            } else {
                icon = "fas fa-exclamation-triangle";
            }
        }
        return icon;
    }
}
