import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherForecast } from './weatherapp.swagger';
import { throwError, of } from 'rxjs';

//Mocked test data returned from the API
const response: WeatherForecast[] = [{
  date: new Date("2023-01-04T00:00:00"),
  temperatureC: -8,
  temperatureF: 118,
  summary: "Freezing"
},
{
  date: new Date("2023-01-05T00:00:00"),
  temperatureC: 40,
  temperatureF: 103,
  summary: "Scorching"
},
{
  date: new Date("2023-01-06T00:00:00"),
  temperatureC: 36,
  temperatureF: 96,
  summary: "Sweltering"
},
{
  date: new Date("2023-01-07T00:00:00"),
  temperatureC: 51,
  temperatureF: 123,
  summary: "Scorching"
},
{
  date: new Date("2023-01-08T00:00:00"),
  temperatureC: 10,
  temperatureF: 49,
  summary: "Cool"
},
];

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
    
    expect(compiled.querySelector('span[class="content"]')?.textContent).toContain('TestUI app is running!');
  });

  it('should set weatherData', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(app.client, 'unauthenticated').and.returnValue(of(response));
    app.getWeather();
    expect(app.weatherData).toEqual(response);
  });

  it('should call handleError', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(app.client, 'unauthenticated').and.returnValue(throwError(() => new Error("Fail")));
    spyOn(app, "handleError");

    app.getWeather();

    expect(app.handleError).toHaveBeenCalled();
  });

  it('should call alert', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(window, 'alert');
    app.handleError("test");

    expect(window.alert).toHaveBeenCalled();
  });

});
