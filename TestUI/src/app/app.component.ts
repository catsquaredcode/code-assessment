import {Component} from '@angular/core';
import {Client, WeatherForecast} from "./weatherapp.swagger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Client]
})
export class AppComponent {
  weatherData: WeatherForecast[] = [
    //data to use since I can't use TestAPI
    {
      date: new Date(),
      temperatureC: 27,
      temperatureF: 77,
      summary: " Freezing"
    },
    {
      date: new Date(),
      temperatureC: 36,
      temperatureF: 100,
      summary: "Bracing"
    },
    {
      date: new Date(),
      temperatureC: 10,
      temperatureF: 45,
      summary: "Chilly"
    },
    {
      date: new Date(),
      temperatureC: 30,
      temperatureF: 100,
      summary: "Mild"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Balmy"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Cool"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Warm"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Hot"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Sweltering"
    },
    {
      date: new Date(),
      temperatureC: 34,
      temperatureF: 120,
      summary: "Scorching"
    }
  ];

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
    this.client.weatherForecast().subscribe({
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

  changeToCyan(text: string | undefined) {
    if(text) {
      let temp = text.toLowerCase();
      return temp.includes('freezing') || temp.includes('bracing') || temp.includes('chilly');
    }
    else
    return false;
  }

  changeToGreen(text: string | undefined) {
    if(text) {
      let temp = text.toLowerCase();
      return temp.includes('mild') || temp.includes('balmy') || temp.includes('cool');
    }
    else return false;
  }

  changeToOrange(text: string | undefined) {
    if(text) {
      let temp = text.toLowerCase();
      return temp.includes('warm') || temp.includes('hot');
    }
    else return false;
  }

  changeToRed(text: string | undefined) {
    if(text) {
      let temp = text.toLowerCase();
      return temp.includes('sweltering') || temp.includes('scorching');
    }
    else return false;
  }
}
