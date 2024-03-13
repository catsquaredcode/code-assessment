import {Component} from '@angular/core';
import {Client, WeatherForecast, WeatherForecastPresentation, summaryCat} from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  weatherData: WeatherForecastPresentation[] = [];
  title:string="TestUI"
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
        this.weatherData = data.map(wf=>{return this.WFMapToPresentation(wf) });
      }
    })
  }

  /**
   * Converts a weatherForecast object into a presentation representation by adding a CSS class based on the summary.
   * @param {WeatherForecast} wf - Weather forecast object to be converted.
   * @returns {WeatherForecastPresentation} - Presentation representation of the weather forecast with an added CSS class.
   * @description This function takes a WeatherForecast object as input and determines the appropriate CSS class based on the weather summary. It then returns a copy of the WeatherForecast object with the CSS class added.
   */
  WFMapToPresentation(wf:WeatherForecast):WeatherForecastPresentation{
    let cssClass:string
      switch (wf.summary){
        case summaryCat.FREEZING:
        case summaryCat.BRACING:
        case summaryCat.CHILLY:
          cssClass="cyan"
          break;
        case summaryCat.MILD:
        case summaryCat.BALMY:
        case summaryCat.COOL:
          cssClass="Green"
          break;
        case summaryCat.WARM:
        case summaryCat.HOT:
          cssClass="orange"
          break;
        case summaryCat.SCORCHING:
        case summaryCat.SWELTERING:
          cssClass="red"
          break;
        default:
          cssClass="neutral"
      }
      return {...wf,...{cssClass}}
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
