import { Component, Inject } from '@angular/core';
import { Client, WeatherForecast } from "./weatherapp.swagger";
import { LocalesEnum } from './enums/locales.enum';
import { BROWSER_LOCALE } from './app.module';

import { DateFormatsByLocale } from './consts/date-formats-by-locale.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {

   /**
   * Get the weather data.
   * 
   * @returns The weather data.
   */
   public get weatherData(): WeatherForecast[] {
    return this._weatherData;
  }

  /**
   * Get the date format based on the locale.
   * 
   * @returns The date format.
   */
  public get format(): string {
    return DateFormatsByLocale[this._locale];
  }
  
  private _weatherData: WeatherForecast[] = [];

  constructor(
    @Inject(BROWSER_LOCALE) private _locale: LocalesEnum,
    private _client: Client
  ) {
    this.getWeather();
  }

  /**
   * Get Current Weather
   *
   * @description Gets current weather from API
   */
  getWeather() {
    this._client.unauthenticated().subscribe({
      complete: () => { },
      error: (error) => {
        this.handleError(error);
      },
      next: (data: WeatherForecast[]) => {
        this._weatherData = data;
      }
    })
  }

  /**
   * Dummy Error Handler
   *
   * @description throws error state
   * @param error
   */
  handleError(error: string) {
    alert(error);
  }
}
