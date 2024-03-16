import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { API_BASE_URL, Client, WeatherForecast } from './weatherapp.swagger';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockClient {
  unauthenticated(): Observable<WeatherForecast[]> {
    return of([{
      date: new Date(),
      temperatureF: 87,
      temperatureC: 31,
      summary: "Hot"
    },
    {
      date: new Date(),
      temperatureF: 75,
      temperatureC: 24,
      summary: "Warm"
    },
    {
      date: new Date(),
      temperatureF: 120,
      temperatureC: 49,
      summary: "Scorching"
    },
    {
      date: new Date(),
      temperatureF: 116,
      temperatureC: 47,
      summary: "Scorching"
    },
    {
      date: new Date(),
      temperatureF: 109,
      temperatureC: 43,
      summary: "Scorching"
    }]);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let client: Client;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Client, useClass: MockClient },
        HttpClient,
        { provide: API_BASE_URL, useValue: environment.url },
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    client = TestBed.inject(Client);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize weatherData with the data from the API', (done) => {
    expect(component.weatherData.length).toBe(0); // Check that the weatherData array is initially empty
    client.unauthenticated().pipe(
      tap((result) => {
        expect(result.length).toBe(5); // Check that the API call returns an array of length 5
        done(); // Indicate that the asynchronous test is complete
      }),
    ).subscribe();

    spyOn(client, 'unauthenticated'); // Spy on the unauthenticated method of the client object
    component.getWeather(); // Call the getWeather method of the component
  });

});