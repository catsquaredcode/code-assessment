import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LocalesEnum } from 'src/app/enums/locales.enum';
import { DateFormatsByLocale } from 'src/app/consts/date-formats-by-locale.const';
import { SummariesColorsByWeatherType } from 'src/app/consts/summaries-colors-by-weather-type.const';
import { WeathersTypesEnum } from 'src/app/enums/weathers-types.enum';
import { Component, InjectionToken, Input } from '@angular/core';
import { WeatherForecast } from 'src/app/weatherapp.swagger';

const BROWSER_LOCALE = new InjectionToken<string>('BROWSER_LOCALE');

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let locale: LocalesEnum;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [WeatherComponent],
      providers: [
        { provide: BROWSER_LOCALE, useValue: navigator.language }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
