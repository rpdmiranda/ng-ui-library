import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';

@Component({
  selector: 'ngx-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ChipsComponent,
    multi: true
  }]
})
export class ChipsComponent implements ControlValueAccessor {

  @Input()
  inputFormatter: (_: any) => string;

  @Input()
  search: (text$: Observable<string>) => Observable<any[]>;

  @Input()
  editable = false;

  @Input()
  focusFirst = true;

  @Input()
  readOnly = false;

  @Input()
  disabled = false;

  @Input()
  compareWith: (o1: any, o2: any) => boolean;

  @ViewChild(NgbTypeahead, {static: false})
  typeahead: NgbTypeahead;

  @ViewChild('input', {static: false})
  inputField: ElementRef;

  values: any[];

  /**
   * New value selected
   */
  newValue: any;

  private onChange: (_: any) => void;
  private onTouched: () => void;

  /**
   * Subject used to inject empty values in the search stream
   */
  private readonly subject$ = new Subject<string>();


  constructor() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj == null || Array.isArray(obj)) {
      this.values = obj;
    } else {
      throw new TypeError(`Expecting array, got ${typeof obj}`);
    }
  }

  searchFn = (text$: Observable<string>) => merge(this.subject$, text$).pipe(this.search);


  /**
   * Adds a value to the model and notifies ngModel
   *
   * @param value The value to add
   */
  private addValue(value: any) {
    if (this.disabled || this.readOnly) {
      return;
    }
    if (value != null && value !== '') {
      // Checks if the value is already present
      if (this.values != null) {
        const compare = (this.compareWith != null) ? this.compareWith : (o1, o2) => (o1 === o2);
        if (this.values.findIndex(v => compare(v, value)) >= 0) {
          return;
        }
      }

      if (this.values == null) {
        this.values = new Array(value);
      } else {
        this.values = [...this.values, value];
      }
      this.newValue = null;
      if (this.onChange != null) {
        this.onChange(this.values);
      }
      this.subject$.next('');
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
   * Adds an item if the user press ENTER or TAB keys
   *
   * @param $event Keyboard event
   */
  onKeyDown($event: KeyboardEvent) {
    // Backspace pressed when the caret is at the first position of the input field
    // deletes the last item of the array
    const selectionStart: number = this.inputField.nativeElement.selectionStart;
    const selectionEnd: number = this.inputField.nativeElement.selectionEnd;

    if ('Backspace' === $event.key
      && ((selectionStart === selectionEnd) && selectionStart === 0)
      && this.values != null
      && this.values.length > 0) {
      this.removeItem(this.values.length - 1);
      return;
    }
    if (this.typeahead.isPopupOpen()) {
      return;
    }
    if ('Enter' !== $event.key && 'Tab' !== $event.key) {
      return;
    }
    if (this.newValue != null && this.newValue !== '') {
      this.addValue(this.newValue);
      $event.preventDefault();
    }
  }

  onRemoveItem($event: MouseEvent, index: number): void {
    $event.preventDefault();
    this.removeItem(index);
  }

  /**
   * Remove the specified item
   *
   * @param index Index of the element to remove
   */
  removeItem(index: number): void {
    if (this.disabled || this.readOnly || this.values == null || index < 0 || index >= this.values.length) {
      return;
    }
    this.values = [...this.values.slice(0, index), ...this.values.slice(index + 1)];
    if (this.onChange != null) {
      this.onChange(this.values);
    }
  }
}
