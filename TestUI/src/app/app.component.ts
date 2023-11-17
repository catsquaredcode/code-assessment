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
  title: string = 'TestUI';

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
      complete: () => { },
      error: (error) => {
        this.handleError(error);
      },
      next: (data: WeatherForecast[]) => {
        this.weatherData = data;
      }
    })
  }

  getColor(text: string | undefined) {

    switch (text?.toLocaleLowerCase()) {

      case "freezing":
      case "bracing":
      case "chilly":
        return "cyan";
      case "mild":
      case "balmy":
      case "cool":
        return "green";
      case "warm":
      case "hot":
        return "orange";
      case "sweltering":
      case "scorching":
        return "red";
      default:
        return "black";
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
