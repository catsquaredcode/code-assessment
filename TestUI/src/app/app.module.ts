import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { API_BASE_URL, Client } from "./weatherapp.swagger";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { WeatherComponent } from './components/weather/weather.component';

export const BROWSER_LOCALE = new InjectionToken<string>('BROWSER_LOCALE');

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    Client,
    HttpClient,
    { provide: API_BASE_URL, useValue: environment.url },
    { provide: BROWSER_LOCALE, useValue: navigator.language } // Use the browser's language
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }