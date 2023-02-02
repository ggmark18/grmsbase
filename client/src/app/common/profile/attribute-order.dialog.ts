import { Component, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';

import { Profiles, ProfileFormat } from '@api-dto/common/profile/dto';
import { AttributeEditDialog, CloseFunction } from './attribute-edit.dialog';

import * as _ from 'lodash';

@Component({
    selector: 'attribute-order.dialog',
    templateUrl: './attribute-order.dialog.html',
    styleUrls: ['./profile.scss']
})
export class AttributeOrderDialog {

    attributes: ProfileFormat[] = [];
    childRef = null;
    error = null;
    constructor(@Inject(MAT_DIALOG_DATA) private model: Profiles,
                private editorRef: MatDialogRef<AttributeOrderDialog>,
                private dialog: MatDialog) {
        if( model?.attributes ) {
            this.attributes = Object.assign([], model.attributes);
        }
    }

    drop(event: CdkDragDrop<ProfileFormat[]>) {
        moveItemInArray(this.attributes, event.previousIndex, event.currentIndex);
    }

    editAttribute( attribute = null ) {
        this.childRef = this.dialog.open(AttributeEditDialog, {
            data: attribute,
            width: '350px'
        });
        this.childRef.afterClosed().subscribe((res) => {
            if( res?.function == CloseFunction.SAVE ) {
                var oldItem = _.find(this.attributes, {
                    key: res.value.key
                });
                var index = this.attributes.indexOf(oldItem);
                this.attributes.splice(index, 1, res.value);
            } else if ( res?.function == CloseFunction.DELETE ) {
                _.remove(this.attributes, {
                    key: res.value.key
                });
            } else if ( res?.function == CloseFunction.CREATE ) {
                var oldItem = _.find(this.attributes, {
                    key: res.value.key
                });
                if( oldItem ) {
                    this.error = `属性キー${oldItem.key}は、既に存在します。`;
                } else {
                    this.attributes.push(res.value);
                }
            }
        });
    }

    save() {
        let saveData : Profiles = { attributes: this.attributes } ;
        this.editorRef.close(saveData);
    }
}

