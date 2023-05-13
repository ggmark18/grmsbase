import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotionPost, NotionBlock, NotionPostDigest, NotionPostStatus } from '@api-dto/common/notion/dto';

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
    
    statusColor(post: NotionPost) : string {
        switch (post?.status) {
            case NotionPostStatus.ENTRY: return 'gray';
            case NotionPostStatus.PUBLISH: return 'green';
            case NotionPostStatus.DENIED: return 'red';
            case NotionPostStatus.LIVE: return 'blue';
        }
    }
}
