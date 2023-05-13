import { Component, Inject, Input, Output, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SafeHtml} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { NotionPost, NotionBlock, NotionPostDigest, NotionPostStatus, statusToNotion } from '@api-dto/common/notion/dto';
import { NOTION_DIGEST_APIURL } from '.';
import { NotionHTMLBase } from './NotionHTMLBase';
import { NotionHTMLBlockFactory } from './NotionHTMLBlock.factory';

@Component({
 	selector: 'notion-post-digest',
    templateUrl: './NotionHTMLPost.digest.html',
	styleUrls: ['./NotionHTML.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotionHTMLPostDigest extends NotionHTMLBase {
    @Input() set post( value: NotionPost ) {
        this._post = value;
        super.getDigest(this._post.blockid).subscribe( res => {
            this._digest = res;
            this._thumbnail = this.factory.createTrustedHTML(this._digest?.thumbnail);
        })
    }
    @Input() status: boolean = false
    @Output() event = new EventEmitter<NotionPost>()

    _post?: NotionPost
    _digest: NotionPostDigest
    _thumbnail: SafeHtml
    constructor(protected http : HttpClient,
                protected factory: NotionHTMLBlockFactory,
                @Inject(NOTION_DIGEST_APIURL)
                protected readonly apiurl: string
               ) { super(http, apiurl); }

    readContinue() {
        this.event.emit(this._post)
    }

    getNotionStatus( status: NotionPostStatus ): string {
        return statusToNotion(status)
    }

    get paragraphContent() {
        let text = ""
        if( this._digest?.paragraph?.context?.rich_text ) {
            for( let rtext of this._digest.paragraph.context.rich_text ) {
                text += rtext?.text?.content
            }
            if( text.length > 100 ) {
                text = text.substring(0,100)
                text += " ..."
            }
            return text
        }
    }
}
