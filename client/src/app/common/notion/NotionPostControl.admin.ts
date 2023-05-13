import { Component, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { Observable } from 'rxjs'

import { NotionPostControl, PostApproveType } from '@api-dto/common/notion/dto'

@Component({
    selector: 'notion-postcontrol-admin',
    templateUrl: './NotionPostControl.admin.html',
    styleUrls: ['../profile/profile.scss']
})
export class NotionPostControlAdmin {
    @Input() set control(value: NotionPostControl) {
        this.controlForm.patchValue(value)
    }
    @Input() profileCandidates: any[] = []
    @Input() deletable: boolean = false
    @Output() save = new EventEmitter<NotionPostControl>()
    @Output() del = new EventEmitter<NotionPostControl>()

    types = [
        { value: PostApproveType.WRITER,   label: '投稿者' },
        { value: PostApproveType.ADMIN,    label: '管理者' },
        { value: PostApproveType.APPROVER, label: '承認者' },
    ]

    controlForm: FormGroup

    constructor(private fb: FormBuilder) {
        this.controlForm = this.fb.group({
            _id: [''],
            title: ["", Validators.required],
            writerProfile: [null],
            approveType: [null],
            numberOfApprover: [null],
            disabled: [false],
        });
    }

    saveSubmit() {
        this.save.emit(this.controlForm.value)
    }
    deleteGroup() {
        this.del.emit(this.controlForm.value)
    }
    cancel() {
        this.save.emit(null)
    }

}
