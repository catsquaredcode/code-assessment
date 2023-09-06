import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherForecastMock: WeatherForecast[] = [
    {date: new Date, temperatureC: 45, temperatureF: 113, summary: 'Freezing'},
    {date: new Date, temperatureC: 22, temperatureF: 71, summary: 'Cool'},
  ];
  const clientServiceMock = {
    unauthenticated: () => {
      return of(weatherForecastMock);
    }
  };

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
        { provide: Client, useValue: clientServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.title).toEqual('TestUI');
  });

  it('should get weather successfully', done => {
    spyOn(component.client, 'unauthenticated').and.returnValue(of(weatherForecastMock));
    component.client.unauthenticated().subscribe((result: WeatherForecast[]) => {
      expect(result.length).toBe(2);
      expect(result[0].summary).toBe('Freezing');
      done();
    });
    component.getWeather();
  });

  it('should handle the error', done => {
    const testError = new Error('Test error');
    spyOn(component.client, 'unauthenticated').and.returnValue(throwError(() => testError));
    component.client.unauthenticated().subscribe({
      error: (error) => {
        expect(error).toEqual(testError);
        done();
      }
    });
    component.getWeather();
  });

  it('should get the weather color', () => {
    expect(component.getWeatherColor('Freezing')).toBe('Cyan');
    expect(component.getWeatherColor('Mild')).toBe('Green');
    expect(component.getWeatherColor('Hot')).toBe('Orange');
    expect(component.getWeatherColor('Warm')).toBe('Orange');
    expect(component.getWeatherColor('Scorching')).toBe('Red');
    expect(component.getWeatherColor('Sweltering')).toBe('Red');
    expect(component.getWeatherColor('none')).toBe('black');
  });
});
