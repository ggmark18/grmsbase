import { NotionBlock } from '@api-dto/common/notion/dto';
import { NotionHTMLBlockFactory, NotionBlockProvider } from '../NotionHTMLBlock.factory';

export class Column implements NotionBlockProvider {
    static type : string = 'column';
    createHTML(block: NotionBlock, factory: NotionHTMLBlockFactory) : string {
        let html = "<div class='col'>";
        for( let cblock of block.blocks) {
            html += factory.createHTML(cblock);
        }
        html += "</div>";
        return html;
    }
}
