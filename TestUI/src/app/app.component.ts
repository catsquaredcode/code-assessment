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

  title: string;

  constructor(
    private client: Client
  ) {
    this.title = "TestUI";
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
   * Dummy Error Handler
   *
   * @description throws error state
   * @param error
   */
  handleError(error: string) {
    alert(error);
  }

  getWeatherSummaryColor(summary: string): string {
      switch (summary) {
        case 'Freezing':
        case 'Bracing':
        case 'Chilly':
          return 'cyan';
        case 'Mild':
        case 'Balmy':
        case 'Cool':
          return 'green';
        case 'Warm':
        case 'Hot':
          return 'orange';
        case 'Sweltering':
        case 'Scorching':
          return 'red';
        default:
          return 'black';
      }
  }
}
