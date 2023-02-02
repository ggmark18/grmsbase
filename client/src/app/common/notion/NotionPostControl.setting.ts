import { Component, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner"

import { NotionServiceBase } from '.'
import { NotionDashboard, NotionPostControl, NotionPage ,NotionDashboardPageOperation} from '@api-dto/common/notion/dto'

@Component({
    selector: 'notion-postcontrol-setting',
    templateUrl: './NotionPostControl.setting.html',
    styleUrls: ['../profile/profile.scss']
})
export class NotionPostControlSetting {
    @Input() set control(value: NotionPostControl) {
        this.postControl = value
        if(this._dashboard ) this.setupPage()
    }
    @Input() set dashboard(value: NotionDashboard) {
        this._dashboard = value
        this.notionForm.get('secret').setValue(this._dashboard.secret);
        if( this.postControl ) this.setupPage()
    }
    @Input() set service(value: NotionServiceBase) {
        this.notionService = value
    }

    notionService: NotionServiceBase
                         
    _dashboard: NotionDashboard = undefined
    postControl: NotionPostControl = undefined
    page: NotionPage = undefined
                         
    notionForm: FormGroup
    validPageId = false;
    spinnerMessage;

    constructor(private fb: FormBuilder,
                private spinner: NgxSpinnerService,
                private dialog: MatDialog) {
        this.notionForm = this.fb.group({
            secret: [''],
            pageid: [''],
        });
    }

    setupPage() {
        for( let dp  of this._dashboard.pages ) {
            for( let cp of this.postControl.pages ) {
                if( dp._id == cp._id ) {
                    this.page = dp
                    this.notionForm.get('pageid').setValue(this.page.pageid)
                    this.validPageId = true
                    break
                }
            }
            if( this.page ) break
        }
    }

    checkStatus(pageid) {
        this.validPageId = false
        if( ( pageid.match( new RegExp( "-", "g" ) ) || [] ).length == 4  ){
            this.validPageId = true
        }
    }

    createPostPage() {
        this.spinnerMessage = 'Creating Community Post ...';
        this.spinner.show();
        this.notionService.dashboardPage({
            dashboardid: this._dashboard._id,
            controlid: this.postControl._id,
            operation: NotionDashboardPageOperation.CREATE
        }).subscribe( res => {
            this.spinner.hide();
        },error => {
            console.log(error);
            this.spinner.hide();
        });
    }

}
