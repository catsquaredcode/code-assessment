import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { WEATHER_RANGES } from 'src/_constants/weather.constants';
import { Weather, WeatherType } from 'src/_models/weather.model';


@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  public getWeather(count: number): Observable<Weather[]> {
    const data: Weather[] = [];
    let currentDate: Date = new Date();

    for (let i = 0; i < count; i++) {
      const date: Date = new Date(currentDate);
      date.setHours(date.getHours() + 1);

      const temperatureC: number = this.getRandomCelsius(-70, 70);

      data.push({
        date: date,
        temperatureC: temperatureC,
        temperatureF: this.celsiusToFahrenheit(temperatureC),
        summary: this.getWeatherType(temperatureC),
      });

      currentDate = date;
    }

    return of(data);
  }

  private getRandomCelsius(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private celsiusToFahrenheit(celsius: number): number {
    return celsius * 9/5 + 32;
  }

  private getWeatherType(celsius: number): WeatherType {
    for (const range of WEATHER_RANGES) {
      if (celsius >= range.min && celsius < range.max) {
        return range.type;
      }
    }
    return WeatherType.MILD;
  }

}
