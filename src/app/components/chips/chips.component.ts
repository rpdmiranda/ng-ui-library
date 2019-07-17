import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ChipsComponent,
    multi: true
  }]
})
export class ChipsComponent implements ControlValueAccessor, OnInit {

  @Input()
  inputFormatter: (_: any) => string;

  @Input()
  search: (text$: Observable<string>) => Observable<any[]>;

  @Input()
  editable = false;

  @Input()
  focusFirst = true;

  @ViewChild(NgbTypeahead, {static: true})
  typeahead: NgbTypeahead;

  values: any[];

  /**
   * New value selected
   */
  newValue: any;

  private onChange: (_: any) => void;

  /**
   * Subject used to inject empty values in the search stream
   */
  private readonly subject = new Subject<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj == null || Array.isArray(obj)) {
      this.values = obj;
    } else {
      throw new TypeError(`Expecting array, got ${typeof obj}`);
    }
  }

  searchFn = (text$: Observable<string>) => merge(this.subject, text$).pipe(this.search);

  /**
   * Adds a value to the model and notifies ngModel
   *
   * @param value The value to add
   */
  private addValue(value: any) {
    if (value != null && value !== '') {
      if (this.values == null) {
        this.values = new Array(value);
      } else {
        this.values = [...this.values, value];
      }
      this.newValue = null;
      if (this.onChange != null) {
        this.onChange(this.values);
      }
      this.subject.next('');
    }
  }

  /**
   * Adds an item when the user selects a value from the dropdown
   *
   * @param $event Selected item event
   */
  onSelectedItem($event: NgbTypeaheadSelectItemEvent) {
    $event.preventDefault();
    this.addValue($event.item);
  }

  /**
   * Adds an item if the user press the ENTER key
   *
   * @param $event Keyboard event
   */
  onKeyEnterDown($event: KeyboardEvent) {
    if (this.typeahead.isPopupOpen()) {
      return;
    }
    if ('Enter' !== $event.key && 'Tab' !== $event.key) {
      return;
    }
    if (this.newValue != null && this.newValue !== '') {
      this.addValue(this.newValue);
      this.typeahead.dismissPopup();
    }
  }
}
