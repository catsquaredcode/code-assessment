import { Component } from '@angular/core';
import { Client, WeatherForecast } from './weatherapp.swagger';

interface Color {
  color: string;
  items: string[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client],
})
export class AppComponent {
  title: string = 'Weather Forecast';
  colors: Color[] = [
    { color: 'cyan', items: ['freezing', 'bracing', 'chilly'] },
    { color: 'green', items: ['mild', 'balmy', 'cool'] },
    { color: 'orange', items: ['warm', 'hot'] },
    { color: 'red', items: ['sweltering', 'scorching'] },
  ];
  weatherData: WeatherForecast[] = [];

  constructor(private client: Client) {
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
      },
    });
  }

  /**
   * Set Summary Color
   *
   * @description returns a string that defines a color based on summary
   */
  setColor(summary?: string): string {
    if (summary!) {
      const temp = this.colors.filter(
        (e: Color) => e.items.indexOf(summary.toLowerCase()) > -1
      );
      return temp.length ? temp[0].color : '';
    }
    return '';
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
