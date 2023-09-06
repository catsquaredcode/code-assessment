import {Component, OnInit} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent implements OnInit {
  public weatherData: WeatherForecast[] = [];
  public title = 'TestUI';

  constructor(
    public client: Client
  ) {
  }

  ngOnInit(): void {
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
        this.weatherData = this.getWeatherColorFormatted(data);
      }
    })
  }

  getWeatherColorFormatted(data: WeatherForecast[]): WeatherForecast[] {
    data.forEach((wheather: WeatherForecast) => {
      wheather.color = this.getWeatherColor(wheather.summary);
    });
    return data;
  }

  getWeatherColor(description: string | undefined): string {
    let color: string;
    switch(description) {
      case 'Freezing':
      case 'Bracing':
      case 'Chilly':
        color = 'Cyan';
        break;
      case 'Mild':
      case 'Balmy':
      case 'Cool':
        color = 'Green';
        break;
      case 'Warm':
      case 'Hot':
        color = 'Orange';
        break;
      case 'Sweltering':
      case 'Scorching':
        color = 'Red';
        break;
      default:
        color = 'black';
        break;
    }
    return color;
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
