import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment'
import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app-root.component.html',
    styleUrls: ['./app-root.component.scss'],
    providers: [ Title ] 
})
export class AppRoot {
    
    constructor( private title: Title ) {
        this.title.setTitle(environment.title);
        console.log(_.VERSION);
    }

}
