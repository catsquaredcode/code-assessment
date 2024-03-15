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

  constructor(
    public client: Client
  ) {
    this.getWeather();
  }

  /**
   * Format description color of weather
   *
   * @description Assigns the color of the description
   */
  weatherDescriptionColor(description?: string): string {
    if (!description) {
      return 'black';
    }

    if (description.includes('Freezing') || description.includes('Bracing') || description.includes('Chilly')) {
      return 'cyan';
    } else if (description.includes('Mild') || description.includes('Balmy') || description.includes('Cool')) {
      return 'green';
    } else if (description.includes('Warm') || description.includes('Hot')) {
      return 'orange';
    } else if (description.includes('Sweltering') || description.includes('Scorching')) {
      return 'red';
    } else {
      return 'black';
    }
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
    console.error(error);
    /* Sample data for testing to bypass CORS issue. */
    const sampleData = [
      {
        "date": "2024-03-15T00:00:00+01:00",
        "temperatureC": 50,
        "temperatureF": 121,
        "summary": "Scorching"
      },
      {
        "date": "2024-05-02T00:00:00+02:00",
        "temperatureC": 23,
        "temperatureF": 73,
        "summary": "Warm"
      },
      {
        "date": "2024-03-16T00:00:00+01:00",
        "temperatureC": 46,
        "temperatureF": 114,
        "summary": "Scorching"
      },
      {
        "date": "2024-03-17T00:00:00+01:00",
        "temperatureC": 13,
        "temperatureF": 55,
        "summary": "Cool"
      },
      {
        "date": "2024-03-18T00:00:00+01:00",
        "temperatureC": 4,
        "temperatureF": 39,
        "summary": "Freezing"
      }
    ];

    this.weatherData = sampleData as any;
  }
}
