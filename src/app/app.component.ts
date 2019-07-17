import {Component, OnInit} from '@angular/core';
import {COUNTRIES, Country, COUNTRY_NAMES} from './country';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly initialVlues = ['BR', 'US'];

  countries: Country[];

  countryNames: string[];

  displayFn(value: Country): string {
    return value.name;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ?
        [] :
        COUNTRIES.filter(c => c.name.toLowerCase().indexOf(term.toLowerCase()) >= 0))
    );

  searchNames = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ?
        [] :
        COUNTRY_NAMES.filter(c => c.toLowerCase().indexOf(term.toLowerCase()) >= 0))
    );

  ngOnInit(): void {
    this.countries = COUNTRIES.filter(c => (this.initialVlues.indexOf(c.code) >= 0));
  }
}
