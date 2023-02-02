import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NotionPost, NotionBlock } from '@api-dto/common/notion/dto';
import { NOTION_BLOCKS_APIURL } from '.';
import { NotionHTMLBase } from './NotionHTMLBase';

@Component({
 	selector: 'notion-post',
    templateUrl: './NotionHTMLPost.component.html',
	styleUrls: ['./NotionHTML.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotionHTMLPostComponent extends NotionHTMLBase {
    @Input() set post( value: NotionPost ) {
        this._post = value;
        super.getBlocks(this._post.blockid, this._post.blockid).subscribe( res => {
            this._blocks = res;
        });
    }
    _post?: NotionPost;
    _blocks: NotionBlock[];
    constructor(protected http : HttpClient,
                @Inject(NOTION_BLOCKS_APIURL)
                protected readonly apiurl: string
               ) { super(http, apiurl); }
}
