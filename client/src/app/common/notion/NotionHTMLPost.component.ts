import { Component, Inject, Input, Output, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { NotionPost, NotionBlock, NotionPostStatus, PostReputation, PostReputationType, statusToNotion } from '@api-dto/common/notion/dto';
import { NOTION_BLOCKS_APIURL, NOTION_STATUS_APIURL } from '.';
import { NotionHTMLBase } from './NotionHTMLBase';

// Status validator
function statusValidator(control: FormControl): { [key: string]: any } | null {
    const forbidden = control.value === null
        && control.parent && control.parent.get('status').value === NotionPostStatus.PUBLISH;
    return forbidden ? { 'needPostDate': true } : null;
}

export class NotionPostMixIn {
    constructor( public post : NotionPost ) {}

    writerName(): string {
        return this.post.writer ? this.post.writer.name : '-';
    }
}

@Component({
 	selector: 'notion-post',
    templateUrl: './NotionHTMLPost.component.html',
	styleUrls: ['./NotionHTML.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotionHTMLPostComponent extends NotionHTMLBase {
    @Input() set post( value: NotionPostMixIn ) {
        if( value ) {
            this._post = value
            super.getBlocks(this._post.post.blockid, this._post.post.blockid).subscribe( res => {
                this._blocks = res
            })
            this.statusForm.patchValue(this._post.post)
            this.updateReputation()
        }
    }
    @Input() set reputations( values: PostReputation[] ) {
        if( values ) {
            this._reputations = values
            this.updateReputation()
        }
    }
    @Input() status: boolean = false
    @Output() changeStatus = new EventEmitter<NotionPost>()
    @Input() reputation: PostReputation = undefined
    @Output() changeReputation = new EventEmitter<PostReputation>()
    @Input() disabled: string = null


    statuses = [
        { value: NotionPostStatus.ENTRY, label: undefined },
        { value: NotionPostStatus.PUBLISH, label: undefined },
        { value: NotionPostStatus.LIVE, label: undefined },
        { value: NotionPostStatus.DENIED, label: undefined },
    ]

    reputationTypes = [
        { value: PostReputationType.LIKE, label: '👍' , reputators: [], explain: 'いいね'},
        { value: PostReputationType.CHEER, label: '📣' , reputators: [],explain: 'ガンバレ'},
        { value: PostReputationType.SORRY, label: '😢' , reputators: [],explain: '悲しいね'},
        { value: PostReputationType.LOVE, label: '💖' , reputators: [], explain: 'LOVE'},
    ]
    
    _post?: NotionPostMixIn
    _blocks: NotionBlock[]
    _reputations: PostReputation[] = []

    statusForm: FormGroup;
    constructor(protected http : HttpClient,
                protected fb: FormBuilder,
                @Inject(NOTION_BLOCKS_APIURL)
                protected readonly apiurl: string,
                @Inject(NOTION_STATUS_APIURL)
                protected readonly statusChangeURL: string) {
        super(http, apiurl);
        this.statusForm = this.fb.group({
            blockid: [null],
            postDate:[null, [statusValidator]],
            status:['', [Validators.required]]
        });
        for (const status of this.statuses) {
            status.label = statusToNotion(status.value)
        }
    }

    updateStatus() {
        this.http.put<NotionPost>(this.statusChangeURL, this.statusForm.value).subscribe( res => {
            this._post.post = res
            this.changeStatus.emit(this._post.post)
        });
    }
    updateReputation() {
        for( let type of this.reputationTypes ) {
            type.reputators = []
        }
        for( let rep of this._reputations ) {
            for( let type of this.reputationTypes ) {
                if( rep.reputation === type.value ) {
                    type.reputators.push(rep.reputator.name)
                }
            }
        }
    }

    getNotionStatus( status: NotionPostStatus ) {
        return statusToNotion(status)
    }

    setReputation( reputation: PostReputationType ) {
        this.changeReputation.emit(this.reputation)
    }
    list( reputators: string[], max: number ) {
        let names = reputators.slice(0,max).join('\n')
        if( reputators.length > max ) names += `\n他${reputators.length-max}人`
        return names
    }

}
