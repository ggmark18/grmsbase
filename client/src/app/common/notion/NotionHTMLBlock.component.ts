import { Component, Inject, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { NotionPost, NotionBlock } from '@api-dto/common/notion/dto';
import { NOTION_BLOCKS_APIURL } from '.';
import { NotionHTMLBase } from './NotionHTMLBase';
import { NotionHTMLBlockFactory } from './NotionHTMLBlock.factory';

@Component({
	selector: 'notion-block',
	template: `<div [innerHTML]="_context"></div>
               <div *ngFor="let block of _cblocks">
                   <notion-block [block]="block"></notion-block>
               </div>
              `,
	styleUrls: ['./NotionHTML.component.scss'],
})
export class NotionHTMLBlockComponent extends NotionHTMLBase {
    @Input() set block( value: NotionBlock ) {
        this._block = value;
        this._context = this.factory.createTrustedHTML(this._block);
        if( this._block.blocks && this._block.blocks.length == 0 ) {
            super.getBlocks(this._block.post.blockid, this._block.blockid).subscribe( res => {
                this._cblocks = res;
            });
        }
    }
    _block? : NotionBlock;

    _context?: SafeHtml;
    _cblocks : NotionBlock[] = [];
    
    constructor(protected factory: NotionHTMLBlockFactory,
                protected http : HttpClient,
                @Inject(NOTION_BLOCKS_APIURL)
                protected readonly apiurl: string
               ) {
        super(http, apiurl);
    }
}
