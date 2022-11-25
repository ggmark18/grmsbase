import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio'; 
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    exports: [
	    MatTableModule,
	    MatPaginatorModule,
	    MatToolbarModule,
	    MatMenuModule,
	    MatTabsModule,
	    MatCardModule,
	    MatListModule,
        MatExpansionModule,
	    MatButtonModule,
	    MatButtonToggleModule,
	    MatIconModule,
	    MatDialogModule,
	    MatInputModule,
	    MatFormFieldModule,
	    MatSelectModule,
	    MatAutocompleteModule,
        MatNativeDateModule,
	    MatDatepickerModule,
	    MatTooltipModule,
        MatRadioModule,
	    NgChartsModule,
        DragDropModule, 
    ],
    providers: [
	    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}
    ]
})
export class AppMaterialModule { }
