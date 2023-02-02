import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotionPost, NotionBlock, NotionPostDigest } from '@api-dto/common/notion/dto';

export class NotionHTMLBase {
    constructor( protected http : HttpClient,
                 protected readonly apiurl: string ) {
    }

    getBlocks(postid, blockid) : Observable<NotionBlock[]> {
        return this.http.get<NotionBlock[]>(`${this.apiurl}/${postid}/${blockid}`);
    }

    getDigest(postid) : Observable<NotionPostDigest> {
        return this.http.get<NotionPostDigest>(`${this.apiurl}/${postid}`);
    }
}
