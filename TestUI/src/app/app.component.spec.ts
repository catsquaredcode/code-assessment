import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Client } from './weatherapp.swagger';
import { of } from 'rxjs';


describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [Client]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should get current weather', inject([Client], () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    interface WeatherForecast {
      date: Date;
      temperatureC: number;
      temperatureF: number;
      summary: string;
    };

    const sampleData: Array<WeatherForecast> = [
      {
        "date": new Date(),
        "temperatureC": 50,
        "temperatureF": 121,
        "summary": "Scorching"
      },
      {
        "date": new Date(),
        "temperatureC": 23,
        "temperatureF": 73,
        "summary": "Warm"
      },
      {
        "date": new Date(),
        "temperatureC": 46,
        "temperatureF": 114,
        "summary": "Scorching"
      },
      {
        "date": new Date(),
        "temperatureC": 13,
        "temperatureF": 55,
        "summary": "Cool"
      },
      {
        "date": new Date(),
        "temperatureC": 4,
        "temperatureF": 39,
        "summary": "Freezing"
      }
    ];

    spyOn(app.client, 'unauthenticated').and.returnValue(of(sampleData));
    app.getWeather();
    expect(app.weatherData).toEqual(sampleData);
  }));



  it('should return correct color for weather description', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.weatherDescriptionColor('Freezing')).toBe('cyan');
    expect(app.weatherDescriptionColor('Bracing')).toBe('cyan');
    expect(app.weatherDescriptionColor('Chilly')).toBe('cyan');

    expect(app.weatherDescriptionColor('Mild')).toBe('green');
    expect(app.weatherDescriptionColor('Balmy')).toBe('green');
    expect(app.weatherDescriptionColor('Cool')).toBe('green');

    expect(app.weatherDescriptionColor('Warm')).toBe('orange');
    expect(app.weatherDescriptionColor('Hot')).toBe('orange');
 
    expect(app.weatherDescriptionColor('Sweltering')).toBe('red');
    expect(app.weatherDescriptionColor('Scorching')).toBe('red');

    expect(app.weatherDescriptionColor('Unknown')).toBe('black');
    expect(app.weatherDescriptionColor(undefined)).toBe('black');
  });

});
