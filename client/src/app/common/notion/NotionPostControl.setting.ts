import { Component, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { Observable } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner"

import { AppRootLayout } from '@grms/app-root.layout';
import { NotionServiceBase } from '.'
import { NotionDashboard, NotionPostControl, NotionPage ,NotionDashboardPageOperation} from '@api-dto/common/notion/dto'

import _ from 'lodash'

interface PostControlPage {
    control: NotionPostControl
    mypage?: NotionPage
}

@Component({
    selector: 'notion-postcontrol-setting',
    templateUrl: './NotionPostControl.setting.html',
    styleUrls: ['../profile/profile.scss']
})
export class NotionPostControlSetting {
    @Input() set controls(value: NotionPostControl[]) {
        let pcps = []
        for (let control of value) pcps.push({ control, mypage:undefined })
        this.postControlPages = pcps
        console.log('postControlPages', this.postControlPages)
        if(this._dashboard ) this.setupPage()
    }
    @Input() set dashboard(value: NotionDashboard) {
        this._dashboard = value
        if( this.postControlPages ) this.setupPage()
    }
    @Input() set service(value: NotionServiceBase) {
        this.notionService = value
    }

    notionService: NotionServiceBase
                         
    _dashboard: NotionDashboard = undefined
    postControlPages: PostControlPage[] = undefined
    page: NotionPage = undefined
                         
    spinnerMessage;

    constructor(public layout: AppRootLayout,
                private fb: FormBuilder,
                private spinner: NgxSpinnerService ){
    }

    setupPage() {
        for( let pcp of this.postControlPages ) {
            for( let cpage of pcp.control.pages ) {
                pcp.mypage = _.find(this._dashboard.pages, (page) => page._id == cpage._id)
                if( pcp.mypage ) break
            }
        }
    }

    createPostPage(control: NotionPostControl) {
        this.spinnerMessage = `Creating ${control.title} Notion Page...`;
        this.spinner.show();
        this.notionService.dashboardPage({
            dashboardid: this._dashboard._id,
            controlid: control._id,
            operation: NotionDashboardPageOperation.CREATE
        }).subscribe( res => {
            this.spinner.hide();
            this.layout.subscribeLayoutConfig()
        },error => {
            console.log(error);
            this.spinner.hide();
        });
    }

}
