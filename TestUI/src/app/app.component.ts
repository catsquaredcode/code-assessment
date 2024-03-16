import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";

type ColorDescription = 'Freezing' | 'Bracing' | 'Chilly' | 'Mild' | 'Balmy' | 'Cool' | 'Warm' | 'Hot' | 'Sweltering' | 'Scorching';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  weatherData: WeatherForecast[] = [];
  colorMap: Record<ColorDescription, string> = {
    'Freezing': 'cyan',
    'Bracing': 'cyan',
    'Chilly': 'cyan',
    'Mild': 'green',
    'Balmy': 'green',
    'Cool': 'green',
    'Warm': 'orange',
    'Hot': 'orange',
    'Sweltering': 'red',
    'Scorching': 'red'
  };


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
   * Dummy Error Handler
   *
   * @description throws error state
   * @param error
   */
  handleError(error: string) {
    alert(error);
  }

  /**
   * Get color based on weather description
   *
   * @param summary Weather summary
   * @returns color string
   */
  getColor(summary: string | undefined): string {
    const color = summary as ColorDescription;
    return this.colorMap[color] || 'black'; // Default color
  }

}
