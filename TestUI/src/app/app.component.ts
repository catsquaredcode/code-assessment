import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  weatherData: WeatherForecast[] = [];

  title = 'TestUI';

  constructor(
    public client: Client
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
   * Get Weather Color
   *
   * @description Returns color based on weather summary
   * @param summary
   */
    getWeatherColor(summary: string): string {
      summary = summary.toLowerCase();
      switch (summary) {
        case 'freezing':
        case 'bracing':
        case 'chilly':
          return 'cyan';
        case 'mild':
        case 'balmy':
        case 'cool':
          return 'green';
        case 'warm':
        case 'hot':
          return 'orange';
        case 'sweltering':
        case 'scorching':
          return 'red';
        default:
          return 'black';
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
