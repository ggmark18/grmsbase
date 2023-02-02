import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NotionBlock } from '@api-dto/common/notion/dto';
import { NotionHTMLBlockFactory, NotionBlockProvider } from '../NotionHTMLBlock.factory';

export class Video implements NotionBlockProvider {
    static type : string = 'video';

    constructor(private sanitizer: DomSanitizer) {}
    
    createHTML(block: NotionBlock, factory: NotionHTMLBlockFactory) : string {
        let url = this.replaceToSafeURL(block.context.external.url);
        let html = `<div class="video"><iframe width="56" height="32" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        return html;
    }

    replaceToSafeURL(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        let youtubeID = (match&&match[7].length==11)? match[7] : false;
        if( youtubeID ) {
            return `https://www.youtube.com/embed/${youtubeID}`;
        }
        return url
    }
}
