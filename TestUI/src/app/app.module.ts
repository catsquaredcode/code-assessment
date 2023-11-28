import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { API_BASE_URL, Client } from "./weatherapp.swagger";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    Client,
    HttpClient,
    HttpClientModule,
    {provide: API_BASE_URL, useValue: environment.url},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
