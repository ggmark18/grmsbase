import { NgModule, InjectionToken, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs'
import { NgxSpinnerModule } from "ngx-spinner";

import { NotionPostControl, NotionPage, NotionDashboardPageParam } from '@api-dto/common/notion/dto'
import { NotionDashboardSetting } from './NotionDashboard.setting'
import { NotionPostControlSetting } from './NotionPostControl.setting'
import { NotionPostControlAdmin } from './NotionPostControl.admin'
import { NotionHTMLPostComponent } from './NotionHTMLPost.component'
import { NotionHTMLPostDigest } from './NotionHTMLPost.digest'
import { NotionHTMLBlockComponent } from './NotionHTMLBlock.component'
import { NotionHTMLBlockFactory } from './NotionHTMLBlock.factory'

export { NotionPostMixIn } from './NotionHTMLPost.component'
export const NOTION_BLOCKS_APIURL = new InjectionToken<string>('api.blocks.url')
export const NOTION_DIGEST_APIURL = new InjectionToken<string>('api.digest.url')
export const NOTION_STATUS_APIURL = new InjectionToken<string>('api.status.url')
// set Provider using this module like
// 	    {provide: NOTION_BLOCKS_APIURL, useValue: '/api/notion/blocks' }
export interface NotionServiceBase {
    connectCheck(value) : Observable<any>,
    getPostControl(id) : Observable<NotionPostControl>,
    dashboardPage(param:NotionDashboardPageParam) : Observable<NotionPage>
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgxSpinnerModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatCardModule 
    ],
    declarations: [
        NotionDashboardSetting,
        NotionPostControlSetting,
        NotionPostControlAdmin,
        NotionHTMLBlockComponent,
        NotionHTMLPostComponent,
        NotionHTMLPostDigest,
    ],
    exports: [
        NotionDashboardSetting,
        NotionPostControlAdmin,
        NotionPostControlSetting,
        NotionHTMLBlockComponent,
        NotionHTMLPostComponent,
        NotionHTMLPostDigest,
    ],
    providers: [
        NotionHTMLBlockFactory,
        {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}
    ]
})
export class NotionHTMLModule { }


