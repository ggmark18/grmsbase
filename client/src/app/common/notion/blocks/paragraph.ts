import { NotionBlock } from '@api-dto/common/notion/dto';
import { NotionHTMLBlockFactory, NotionBlockProvider } from '../NotionHTMLBlock.factory';

export class Paragraph implements NotionBlockProvider {
    static type : string = 'paragraph';
    createHTML(block: NotionBlock,factory: NotionHTMLBlockFactory) : string {
        let html = "<div class='paragraph'>";
        for( let rtext of block.context.rich_text ) {
            html += rtext.text.content;
        }
        html += "</div>";
        return html;
    }
}
