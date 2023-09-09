import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";
import { WEATHER_COLORS } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  public weatherData: WeatherForecast[] = [];
  public title: string = 'TestUI'
  public subtitle: string = 'TestUI app is running!'

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
  private getWeather() {
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
   * Dummy Error Handler
   *
   * @description throws error state
   * @param error
   */
  private handleError(error: string) {
    alert(error);
  }

  /**
   * Get color 
   *
   * @description Get color according to description
   * @param weather
   */
  public getWeatherColor(weather: string | undefined): string {
    return weather ? WEATHER_COLORS[weather.toUpperCase() as keyof typeof WEATHER_COLORS] : 'gray';
  }
}
