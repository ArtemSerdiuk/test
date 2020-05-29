import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiTagComponent } from './multi-tag.component';

@NgModule({
  declarations: [
    MultiTagComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    MultiTagComponent,
  ],
})
export class MultiTagModule {
}
