import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppRootLayout } from '../../app-root.layout';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./headerfooter.component.scss']
})
export class FooterComponent implements OnInit {

    constructor(
        private layout: AppRootLayout,
	    private router: Router ) {}

    ngOnInit() {
    }
    get visible() { return this.layout.hasFooter(); }
}

