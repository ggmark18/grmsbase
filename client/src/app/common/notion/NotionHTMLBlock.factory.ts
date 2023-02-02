import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { NotionBlock } from '@api-dto/common/notion/dto';

import { Paragraph } from './blocks/paragraph';
import { Image } from './blocks/image';
import { Video } from './blocks/video';
import { ColumnList } from './blocks/column_list';
import { Column } from './blocks/column';

export interface NotionBlockProvider {
    createHTML(block: NotionBlock, factory: NotionHTMLBlockFactory ) : string;
}

@Injectable()
export class NotionHTMLBlockFactory {

    htmlBlockProviders = {};
    
    constructor(private sanitizer: DomSanitizer ) {
        this.htmlBlockProviders[Paragraph.type] = new Paragraph();
        this.htmlBlockProviders[Image.type] = new Image();
        this.htmlBlockProviders[Video.type] = new Video(sanitizer);
        this.htmlBlockProviders[ColumnList.type] = new ColumnList();
        this.htmlBlockProviders[Column.type] = new Column();
    }

    createHTML(block: NotionBlock) : string {
        let context = "";
        let htmlBlock = this.htmlBlockProviders[block.type];
        if ( ! htmlBlock ) {
            console.log(`Unsupported type:${block.type}`);
        } else {
            context = htmlBlock.createHTML(block,this);
        }
        return context;
    }
    
    createTrustedHTML(block: NotionBlock) : SafeHtml {
        let context = this.createHTML(block);
        let trustedContext = this.sanitizer.bypassSecurityTrustHtml(context);
        return trustedContext;
    }
}
