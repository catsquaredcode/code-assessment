import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { WEATHER_COLORS } from './app.constants';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const dummyWeatherForecats: WeatherForecast[] = [
    {
      "date": new Date("2023-09-08T00:00:00"),
      "temperatureC": 4,
      "temperatureF": 39,
      "summary": "Freezing",
    },
    {
      "date": new Date("2023-09-11T00:00:00"),
      "temperatureC": 33,
      "temperatureF": 91,
      "summary": "Hot",
    },
    {
      "date": new Date("2023-09-09T00:00:00"),
      "temperatureC": -16,
      "temperatureF": 4,
      "summary": "Freezing",
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Client, useValue:
          {
            unauthenticated: () => {
              return of(dummyWeatherForecats);
            }
          }
        }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TestUI'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('TestUI');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.container span')?.textContent).toContain('TestUI app is running!');
  });

  it('should retrieve weather forecast data', done => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.client, 'unauthenticated').and.returnValue(of(dummyWeatherForecats));
    app.client.unauthenticated().subscribe((result: WeatherForecast[]) => {
      expect(result).toBe(dummyWeatherForecats);
      done();
    });
    app.getWeather();
    expect(app.weatherData).toBeDefined();
  });

  it('should retrieve weather forecast ERROR', done => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.client, 'unauthenticated').and.returnValue(throwError(() => 'Error'));
    app.client.unauthenticated().subscribe({
      error: (e) => {
        expect(e).toBeTruthy();
        done();
      }
    });
    app.getWeather();
    expect(app.weatherData).toEqual([]);
  });

  it('should return weather color', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const freezingColor = app.getWeatherColor(dummyWeatherForecats[0].summary)
    expect(freezingColor).toBe(WEATHER_COLORS.FREEZING)
    const hotColor = app.getWeatherColor(dummyWeatherForecats[1].summary)
    expect(hotColor).toBe(WEATHER_COLORS.HOT)
  });

  it('should return default weather color when no summary', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const defaultColor = app.getWeatherColor('')
    expect(defaultColor).toBe('gray')
  });
});
