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
  //Note: i needed to move a clone of the component class here to be able to test it.
  @Input() weather!: WeatherForecast;

  //Note: The injection token is not available in the test environment, so i need to declare it here.
  public get locale(): LocalesEnum {
    return this._locale;
  }
  public set locale(value: LocalesEnum) {
    this._locale = value;
  }

  private _locale: LocalesEnum = LocalesEnum.enUS;

  public get format(): string {
    return DateFormatsByLocale[this._locale];
  }

  public get summaryColorClass(): string {
    const summaryAsType: WeathersTypesEnum = this.weather.summary as WeathersTypesEnum;
    return SummariesColorsByWeatherType[summaryAsType];
  }
}

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
    locale = TestBed.inject(BROWSER_LOCALE) as LocalesEnum;
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    component.weather = {
      date: new Date(),
      temperatureF: 87,
      temperatureC: 31,
      summary: "Hot"
    };
    component.locale = locale;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct date format', () => {
    const expectedDateFormat = DateFormatsByLocale[locale];
    expect(component.format).toBe(expectedDateFormat);
  });

  it('should display the correct summary color class', () => {
    const expectedColorClass = SummariesColorsByWeatherType[component.weather.summary as WeathersTypesEnum];
    expect(component.summaryColorClass).toBe(expectedColorClass);
  });
});
