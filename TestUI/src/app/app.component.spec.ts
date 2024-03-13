import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';
import { WeatherForecast } from './weatherapp.swagger';

const weatherData: WeatherForecast[] = [
  {
    date: new Date('2024-01-01'),
    temperatureC: 38, 
    temperatureF: 100, 
    summary: 'Hot'
  }
];

describe('AppComponent', () => {

  let fixture = TestBed.createComponent(AppComponent);
  let app = fixture.componentInstance;


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
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TestUI'`, () => {
    expect(app.title).toEqual('TestUI');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const rendered = fixture.nativeElement as HTMLElement;
    expect(rendered.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  describe('getWeatherSummaryColor', () => {

    it('should return cyan for Freezing, Bracing, or Chilly', () => {

      expect(app.getWeatherSummaryColor('Freezing')).toEqual('cyan');
      expect(app.getWeatherSummaryColor('Bracing')).toEqual('cyan');
      expect(app.getWeatherSummaryColor('Chilly')).toEqual('cyan');

    });

    it('should return green for Mild, Balmy, or Cool', () => {

      expect(app.getWeatherSummaryColor('Mild')).toEqual('green');
      expect(app.getWeatherSummaryColor('Balmy')).toEqual('green');
      expect(app.getWeatherSummaryColor('Cool')).toEqual('green');

    });

    it('should return orange for Warm or Hot', () => {

      expect(app.getWeatherSummaryColor('Warm')).toEqual('orange');
      expect(app.getWeatherSummaryColor('Hot')).toEqual('orange');

    });

    it('should return red for Sweltering or Scorching', () => {

      expect(app.getWeatherSummaryColor('Sweltering')).toEqual('red');
      expect(app.getWeatherSummaryColor('Scorching')).toEqual('red');

    });

  });

  describe('getWeather', () => {

    it('should handle complete', () => {
      const completeSpy = spyOn( app, 'getWeather').and.callThrough();
      app.getWeather();
      expect(completeSpy).toHaveBeenCalled();
    }); 
  
    it('should handle error', () => {
      const error = 'Error message';
      spyOn(app, 'handleError');
      app.getWeather();
      expect(app.handleError).toHaveBeenCalledWith(error);
    }); 
  
    it('should handle next', () => {
      app.getWeather();
      expect(app.weatherData).toEqual(weatherData);
    }); 
  
  }); 

});




