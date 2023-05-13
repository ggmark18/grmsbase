import { Component, Inject, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as AutoKana from 'vanilla-autokana';

@Component({
    selector: 'grms-name-form',
    templateUrl: './name.form.html',
    styleUrls: ['./profile.scss']
})
export class NameForm implements OnInit {
    @Input() set values( namekana ) {
        if( namekana ) this.setValue(namekana);
    }
    @ViewChild('lastkana') lastkanaInput: ElementRef;
    @ViewChild('firstkana') firstkanaInput: ElementRef;

    nameForm: FormGroup;
    
    constructor( private formBuilder: FormBuilder ) {
        this.nameForm = this.formBuilder.group({
            firstname: [''],
            lastname: [''],
            firstkana: [''],
            lastkana: [''],
        });

    }
    ngOnInit() {
        AutoKana.bind('lastname','lastkana');
        AutoKana.bind('firstname','firstkana');
    }
    setValue( namekana ) {
        let names = namekana.name?.split(' ');
        let kanas = namekana.kana?.split(' ');
        let values = { firstname: (names?.length > 1 ) ? names[1] : '',
                       lastname: (names?.length > 0 ) ? names[0] : '',
                       firstkana: (kanas?.length > 1 ) ? kanas[1] : '',
                       lastkana: (kanas?.length > 0 ) ? kanas[0] : '' };
        this.nameForm.patchValue(values);
    }

    getValue() {
        let values = this.nameForm.value;
        return { name: `${values.lastname} ${values.firstname}`,
                 kana: `${this.lastkanaInput.nativeElement.value} ${this.firstkanaInput.nativeElement.value}`}
    }

}
