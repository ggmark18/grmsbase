import { NotionBlock } from '@api-dto/common/notion/dto';
import { NotionHTMLBlockFactory, NotionBlockProvider } from '../NotionHTMLBlock.factory';

export class ColumnList implements NotionBlockProvider {
    static type : string = 'column_list';
    createHTML(block: NotionBlock,factory: NotionHTMLBlockFactory) : string {
        let html = "<div class='row'>";
        for( let cblock of block.blocks) {
            html += factory.createHTML(cblock);
        }
        html += "</div>";
        return html;
    }
}
