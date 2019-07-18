import {NgModule} from '@angular/core';
import {ChipsComponent} from './chips.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [ChipsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    NgbTypeaheadModule,
  ],
  exports: [ChipsComponent]
})
export class ChipsModule {
  constructor() {
    library.add(faTimes);
  }
}
