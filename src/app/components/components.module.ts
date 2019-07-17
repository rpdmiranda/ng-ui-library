import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChipsComponent} from '../components/chips/chips.component';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [ChipsComponent],
  exports: [
    ChipsComponent
  ],
  imports: [
    CommonModule,
    NgbTypeaheadModule,
    FormsModule
  ]
})
export class ComponentsModule {
}
