import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";
import { WeatherClass, WeatherDescription } from './models/weather';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {

  weatherData: WeatherForecast[] = [];
  weatherClass = WeatherClass;
  title: string = 'TestUI';

  constructor(
    private weatherService: WeatherService,
    private client: Client
    ) {
    this.getWeather();
  }

  public getDateFormat(){
    return this.weatherService.getDateFormat();
  }

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

  public getWeatherClass(type: string | undefined): string {
    switch (type) {
      case WeatherDescription.FREEZING:
      case WeatherDescription.BRACING:
      case WeatherDescription.CHILLY:
        return WeatherClass.CYAN;
      case WeatherDescription.MILD:
      case WeatherDescription.BALMY:
      case WeatherDescription.COOL:
        return WeatherClass.GREEN;
      case WeatherDescription.WARM:
      case WeatherDescription.HOT:
        return WeatherClass.ORANGE;
      case WeatherDescription.SWELTERING:
      case WeatherDescription.SCORCHING:
        return WeatherClass.RED;
      default:
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
