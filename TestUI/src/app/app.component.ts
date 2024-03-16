import { Component } from '@angular/core';
import { Client, WeatherForecast } from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  
  public get weatherData(): WeatherForecast[] {
    return this._weatherData;
  }

  private _weatherData: WeatherForecast[] = [];

  constructor(
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
