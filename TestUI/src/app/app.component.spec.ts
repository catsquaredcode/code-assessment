import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Client, WeatherForecast, summaryCat } from './weatherapp.swagger';
import { Observable, of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let client: Client;
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
    client = TestBed.inject(Client)
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
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });


  it('should add cyan CSS class for freezing, bracing, or chilly weather', () => {
    const weatherForecast = { summary: summaryCat.FREEZING };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = app.WFMapToPresentation(weatherForecast);
    expect(result.cssClass).toBe('cyan');
  });

  it('should add green CSS class for mild, balmy, or cool weather', () => {
    const weatherForecast = { summary: summaryCat.MILD };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = app.WFMapToPresentation(weatherForecast);
    expect(result.cssClass).toBe('green');
  });

  it('should add orange CSS class for warm or hot weather', () => {
    const weatherForecast = { summary: summaryCat.HOT };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = app.WFMapToPresentation(weatherForecast);
    expect(result.cssClass).toBe('orange');
  });

  it('should add red CSS class for scorching or sweltering weather', () => {
    const weatherForecast = { summary: summaryCat.SCORCHING };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = app.WFMapToPresentation(weatherForecast);
    expect(result.cssClass).toBe('red');
  });

  it('should add neutral CSS class for unknown weather summary', () => {
    const weatherForecast = { summary: 'Unknown' };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = app.WFMapToPresentation(weatherForecast);
    expect(result.cssClass).toBe('neutral');
  });

  it('should populate weatherData on API call', () => {
    const WF1:WeatherForecast= {
      date: new Date("2020-11-01T23:00:00.000Z"),
      temperatureC: 0,
      temperatureF: 32,
      summary: "Chilly"
    } 
    const WF2:WeatherForecast= {
      date: new Date("2024-08-02T22:00:00.000Z"),
      temperatureC: 36,
      temperatureF: 96.8,
      summary: "Hot"
    } 
    const mockWeatherForecasts: Observable<WeatherForecast[]> = of([WF1,WF2]);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(client, 'unauthenticated').and.returnValue(mockWeatherForecasts);
    app.getWeather();
    expect(app.weatherData.length).toBe(2);
    expect(app.weatherData[0].cssClass).toBe('cyan');
    expect(app.weatherData[1].cssClass).toBe('orange');
  });

  it('should handleError be called on error', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const handleErrorSpy= spyOn(app,'handleError')
    spyOn(client, 'unauthenticated').and.returnValue(throwError("test error"));
    app.getWeather();
    expect(handleErrorSpy).toHaveBeenCalled()
  });

  it('should open alert on error', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(window, "alert");    
    app.handleError("test error");
     expect(window.alert).toHaveBeenCalledWith("test error");
  });
});
