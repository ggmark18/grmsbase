import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppRootLayout, LayoutConfig, MenuType } from '@grms/app-root.layout';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./headerfooter.component.scss']
})
export class FooterComponent {
    layoutConfig$: Observable<LayoutConfig>;

    constructor(private layout: AppRootLayout,
	            private router: Router ) {
        this.layoutConfig$ = this.layout.getLayoutConfig();
    }

    get visible() { return this.layout.hasFooter(); }
}

