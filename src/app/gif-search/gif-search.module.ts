import { NgModule } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { GifSearchComponent } from './gif-search.component';
import { GifSearchRoutingModule } from './gif-search-routing.module';
import { MultiTagModule } from '../shared/modules/multi-tag/multi-tag.module';

@NgModule({
  declarations: [
    GifSearchComponent,
  ],
  imports: [
    SharedModule,
    NgbPaginationModule,
    GifSearchRoutingModule,
    MultiTagModule,
  ]
})
export class GifSearchModule {
}
