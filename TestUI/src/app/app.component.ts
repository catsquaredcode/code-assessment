import { Component } from '@angular/core';
import { Client, WeatherForecast } from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  weatherData: WeatherForecast[] = [];
  title = "TestUI";

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
      complete: () => { },
      error: (error) => {
        this.handleError(error);
      },
      next: (data: WeatherForecast[]) => {
        this.weatherData = data;
      }
    })
  }

  getTempClass(summary: string | undefined) {

    if (summary != undefined) {
      switch (summary.toLowerCase()) {
        case 'freezing':
        case 'bracing':
        case 'chilly':
          return 'cyan-text';
        case 'mild':
        case 'balmy':
        case 'cool':
          return 'green-text';
        case 'warm':
        case 'hot':
          return 'orange-text';
        case 'sweltering':
        case 'scorching':
          return 'red-text';
        default:
          return '';
      }
    } else {
      return '';
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
