import { Component, Inject, Input } from '@angular/core';
import { BROWSER_LOCALE } from 'src/app/app.module';
import { DateFormatsByLocale } from 'src/app/consts/date-formats-by-locale.const';
import { SummariesColorsByWeatherType } from 'src/app/consts/summaries-colors-by-weather-type.const';
import { LocalesEnum } from 'src/app/enums/locales.enum';
import { WeathersTypesEnum } from 'src/app/enums/weathers-types.enum';
import { WeatherForecast } from 'src/app/weatherapp.swagger';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  @Input() weather!: WeatherForecast;

  /**
   * Get the date format based on the locale.
   * 
   * @returns The date format.
   */
  public get format(): string {

    //Note: This is a simple example, in a real-world application, you would want to handle the case where the locale is not found.
    return DateFormatsByLocale[this._locale];
  }

  /**
  * Get the summary color based on the weather.
  * 
  * @returns The summary color class.
  */
  public get summaryColorClass(): string {
    const summaryAsType: WeathersTypesEnum = this.weather.summary as WeathersTypesEnum;
    //Note: Direct access in record has more performance than using a search in a list or a switch statement.
    return SummariesColorsByWeatherType[summaryAsType];
  }

  constructor(
    @Inject(BROWSER_LOCALE) private _locale: LocalesEnum,
  ) { }


}
