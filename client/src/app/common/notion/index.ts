import { NgModule, InjectionToken, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { Observable } from 'rxjs'
import { NgxSpinnerModule } from "ngx-spinner";

import { NotionPostControl, NotionPage, NotionDashboardPageParam } from '@api-dto/common/notion/dto'
import { NotionDashboardSetting } from './NotionDashboard.setting'
import { NotionPostControlSetting } from './NotionPostControl.setting'
import { NotionHTMLPostComponent } from './NotionHTMLPost.component'
import { NotionHTMLPostDigest } from './NotionHTMLPost.digest'
import { NotionHTMLBlockComponent } from './NotionHTMLBlock.component'
import { NotionHTMLBlockFactory } from './NotionHTMLBlock.factory'

export const NOTION_BLOCKS_APIURL = new InjectionToken<string>('api.blocks.url')
export const NOTION_DIGEST_APIURL = new InjectionToken<string>('api.digest.url')
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
        NgxSpinnerModule,
        MatCardModule 
    ],
    declarations: [
        NotionDashboardSetting,
        NotionPostControlSetting,
        NotionHTMLBlockComponent,
        NotionHTMLPostComponent,
        NotionHTMLPostDigest,
    ],
    exports: [
        NotionDashboardSetting,
        NotionPostControlSetting,
        NotionHTMLBlockComponent,
        NotionHTMLPostComponent,
        NotionHTMLPostDigest,
    ],
    providers: [
        NotionHTMLBlockFactory
    ]
})
export class NotionHTMLModule { }


