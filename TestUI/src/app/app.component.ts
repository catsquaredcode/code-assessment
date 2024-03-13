import { Component } from '@angular/core';

import { Weather, WeatherType } from 'src/_models/weather.model';
import { WeatherService } from 'src/_services/weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public title: string = 'TestUI';
  public weatherData: Weather[] = [];

  constructor(private _weatherService: WeatherService) {
    this.getWeather();
  }

  /**
   * Get Current Weather
   *
   * @description Gets current weather from API
   */
  private getWeather(): void {
    this._weatherService.getWeather(10).subscribe((data: Array<Weather>) => this.weatherData = data);

  }

  public getWeatherClass(type: WeatherType): string {
    switch (type) {
      case WeatherType.FREEZING:
      case WeatherType.BRACING:
      case WeatherType.CHILLY:
        return 'text-info';
      case WeatherType.MILD:
      case WeatherType.BALMY:
      case WeatherType.COOL:
        return 'text-success';
      case WeatherType.WARM:
      case WeatherType.HOT:
        return 'text-warning';
      case WeatherType.SWELTERING:
      case WeatherType.SCORCHING:
        return 'text-danger';
    }
  }

}
