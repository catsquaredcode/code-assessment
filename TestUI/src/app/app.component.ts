import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";

export class WeatherDescriptionConstants {
  public static CYAN_WEATHER = {
    FREEZING : 'freezing',
    BRACING : 'fracing',
    CHILLY : 'chilly'
  }

  public static GREEN_WEATHER = {
    MILD : 'mild',
    BALMY : 'balmy',
    COOL : 'cool'
  }

  public static ORANGE_WEATHER = {
    WARM : 'warm',
    HOT : 'hot',
  }

  public static RED_WEATHER = {
    SWELTERING : 'sweltering',
    SCORCHING : 'scorching'
  }
}

export class WeatherClassConstants {
  public static CYAN_CLASS = 'cyan-weather';
  public static GREEN_CLASS = 'green-weather';
  public static ORANGE_CLASS = 'orange-weather';
  public static RED_CLASS = 'red-weather';
  public static DEFAULT_CLASS = 'other-weather';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {

  weatherData: WeatherForecast[] = [];
  title: string = 'My TestUI'

  constructor(
    private client: Client
  ) {
    this.getWeather();
  }

  /**
   * Get Current Weather
   *
   * @description Gets current weather from API
   */
  getWeather() {
    this.client.unauthenticated().subscribe({
      complete: () => {},
      error: (error) => {
        this.handleError(error);
      },
      next: (data: WeatherForecast[]) => {
        this.weatherData = data;
      }
    })
  }

  /**
   * Get Weather Class
   *
   * @param weatherSummary
   * @returns color based on the summery description
   */
  getWeatherClass(weatherSummary?: string): string {
    switch (weatherSummary?.toLowerCase()) {
      case WeatherDescriptionConstants.CYAN_WEATHER.FREEZING:
      case WeatherDescriptionConstants.CYAN_WEATHER.CHILLY:
      case WeatherDescriptionConstants.CYAN_WEATHER.BRACING:
        return WeatherClassConstants.CYAN_CLASS;

      case WeatherDescriptionConstants.GREEN_WEATHER.BALMY:
      case WeatherDescriptionConstants.GREEN_WEATHER.COOL:
      case WeatherDescriptionConstants.GREEN_WEATHER.MILD:
        return WeatherClassConstants.GREEN_CLASS;

      case WeatherDescriptionConstants.ORANGE_WEATHER.HOT:
      case WeatherDescriptionConstants.ORANGE_WEATHER.WARM:
        return WeatherClassConstants.ORANGE_CLASS;

      case WeatherDescriptionConstants.RED_WEATHER.SCORCHING:
      case WeatherDescriptionConstants.RED_WEATHER.SWELTERING:
        return WeatherClassConstants.RED_CLASS;

      default:
        return WeatherClassConstants.DEFAULT_CLASS
    }
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
