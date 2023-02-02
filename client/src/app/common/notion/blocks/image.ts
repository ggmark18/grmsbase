import { NotionBlock } from '@api-dto/common/notion/dto';
import { NotionHTMLBlockFactory, NotionBlockProvider } from '../NotionHTMLBlock.factory';

export class Image implements NotionBlockProvider {
    static type : string = 'image';
    createHTML(block: NotionBlock,factory: NotionHTMLBlockFactory) : string {
        let html = `<div class="image"><image width="100%" src="${block.context.file.url}"></div>`;
        return html;
    }
}
