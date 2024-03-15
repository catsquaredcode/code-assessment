import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Language } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  public getDateFormat(): string{
    let format: string;
    switch(environment.dateFormat){
      case Language.IT:
        format = 'dd/MM/YYYY';
        break;
      case Language.EN:
        format = 'MM/dd/YYYY';
        break;
      default:
        format = 'MM/dd/YYYY';
    }
    return format;
  }

}