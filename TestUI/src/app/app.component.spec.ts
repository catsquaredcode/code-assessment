import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let compiled: HTMLElement;

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

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TestUI'`, () => {
    expect(app.title).toEqual('TestUI');
  });

  it('should render title', () => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  describe('getWeather', () => {

    it('should handle next callback', () => {
      const weatherData = [{summary: 'Hot', temperatureC: 30, temperatureF: 86, dateFormatted: '2022-01-01'}];
      spyOn(app.client, 'unauthenticated').and.returnValue(of(weatherData));
      app.getWeather();
      expect(app.weatherData).toEqual(weatherData);
    });

    it('should handle error callback', () => {
      const error = 'An error occurred';
      spyOn(app.client, 'unauthenticated').and.returnValue(throwError(error));
      spyOn(app, 'handleError');
      app.getWeather();
      expect(app.handleError).toHaveBeenCalledWith(error);
    });

    it('should handle complete callback', () => {
      const completeSpy = spyOn(app, 'getWeather').and.callThrough();
      app.getWeather();
      expect(completeSpy).toHaveBeenCalled();
    });

  });

  describe('getWeatherColor', () => {

    it('should return cyan for freezing, bracing, or chilly', () => {
      expect(app.getWeatherColor('Freezing')).toEqual('cyan');
      expect(app.getWeatherColor('Bracing')).toEqual('cyan');
      expect(app.getWeatherColor('Chilly')).toEqual('cyan');
    });

    it('should return green for mild, balmy, or cool', () => {
      expect(app.getWeatherColor('Mild')).toEqual('green');
      expect(app.getWeatherColor('Balmy')).toEqual('green');
      expect(app.getWeatherColor('Cool')).toEqual('green');
    });

    it('should return orange for warm or hot', () => {
      expect(app.getWeatherColor('Warm')).toEqual('orange');
      expect(app.getWeatherColor('Hot')).toEqual('orange');
    });

    it('should return red for sweltering or scorching', () => {
      expect(app.getWeatherColor('Sweltering')).toEqual('red');
      expect(app.getWeatherColor('Scorching')).toEqual('red');
    });

    it('should return black for any other summary', () => {
      expect(app.getWeatherColor('')).toEqual('black');
      expect(app.getWeatherColor('Rainy')).toEqual('black');
      expect(app.getWeatherColor('Sunny')).toEqual('black');
      expect(app.getWeatherColor('Cloudy')).toEqual('black');
    });

  });

});
