import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent, WeatherClassConstants, WeatherDescriptionConstants } from './app.component';

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

  let fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
  let app: AppComponent = fixture.componentInstance;

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TestUI'`, () => {
    expect(app.title).toEqual('TestUI');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  describe('getWeather', () => {

    it('should handle next', () => {
      const weatherData = [{
        summary: 'Chilly',
        temperatureC: 8,
        temperatureF: 47,
        date: new Date()
      },{
        summary: 'Warm',
        temperatureC: 37,
        temperatureF: 100,
        date: new Date()
      }];

      app.getWeather();
      expect(app.weatherData).toEqual(weatherData);
    });

    it('should handle error', () => {
      spyOn(app, 'handleError');
      app.getWeather();
      expect(app.handleError).toHaveBeenCalledWith('Error Message');
    });

    it('should handle complete', () => {
      const completeSpy = spyOn( app, 'getWeather').and.callThrough();
      app.getWeather();
      expect(completeSpy).toHaveBeenCalled();
    });

  });

  describe('getWeatherClass', () => {

    it('should return cyan value for freezing, bracing, or chilly summary description', () => {
      expect(app.getWeatherClass(WeatherDescriptionConstants.CYAN_WEATHER.FREEZING)).toEqual(WeatherClassConstants.CYAN_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.CYAN_WEATHER.CHILLY)).toEqual(WeatherClassConstants.CYAN_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.CYAN_WEATHER.BRACING)).toEqual(WeatherClassConstants.CYAN_CLASS);
    });

    it('should return green value for mild, balmy, or cool summary description', () => {
      expect(app.getWeatherClass(WeatherDescriptionConstants.GREEN_WEATHER.BALMY)).toEqual(WeatherClassConstants.GREEN_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.GREEN_WEATHER.MILD)).toEqual(WeatherClassConstants.GREEN_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.GREEN_WEATHER.COOL)).toEqual(WeatherClassConstants.GREEN_CLASS);
    });

    it('should return orange value for warm or hot summary description', () => {
      expect(app.getWeatherClass(WeatherDescriptionConstants.ORANGE_WEATHER.HOT)).toEqual(WeatherClassConstants.ORANGE_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.ORANGE_WEATHER.HOT)).toEqual(WeatherClassConstants.ORANGE_CLASS);
    });

    it('should return red for value sweltering or scorching summary description', () => {
      expect(app.getWeatherClass(WeatherDescriptionConstants.RED_WEATHER.SCORCHING)).toEqual(WeatherClassConstants.RED_CLASS);
      expect(app.getWeatherClass(WeatherDescriptionConstants.RED_WEATHER.SWELTERING)).toEqual(WeatherClassConstants.RED_CLASS);
    });

    it('should return default class for any other summary description', () => {
      expect(app.getWeatherClass()).toEqual(WeatherClassConstants.DEFAULT_CLASS);
      expect(app.getWeatherClass('Sunny')).toEqual(WeatherClassConstants.DEFAULT_CLASS);
    });

  });
});
