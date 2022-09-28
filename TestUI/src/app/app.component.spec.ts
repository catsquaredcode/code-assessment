import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { of, throwError } from 'rxjs';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let client: Client;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [Client],
    }).compileComponents();

    client = TestBed.inject(Client);
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`should create an instance of 'client' service`, () => {
    expect(client).toBeDefined();
  });

  it('should call component.getWeather method in constructor', function () {
    const spy = spyOn(AppComponent.prototype, 'getWeather').and.stub();
    new AppComponent(client);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('component title should be "Weather Forecast"', function () {
    expect(component.title).toEqual('Weather Forecast');
  });

  it('component.getWeather should return a list on success and update component.weatherData', async(() => {
    const response: WeatherForecast[] = [
      {
        date: new Date('2022-09-28T00:00:00'),
        temperatureC: 28,
        temperatureF: 82,
        summary: 'Balmy',
      },
      {
        date: new Date('2022-09-29T00:00:00'),
        temperatureC: 10,
        temperatureF: 49,
        summary: 'Cool',
      },
    ];
    spyOn(Client.prototype, 'unauthenticated').and.returnValue(of(response));
    component.getWeather();
    fixture.detectChanges();
    expect(component.weatherData).toEqual(response);
  }));

  it('component.getWeather should trigger component.handleError on error', async(() => {
    spyOn(Client.prototype, 'unauthenticated').and.returnValue(
      throwError('500')
    );
    const error = spyOn(component, 'handleError').and.stub();
    component.getWeather();
    fixture.detectChanges();
    expect(error).toHaveBeenCalledTimes(1);
  }));

  it('#setColor should return a color based on component.colors', () => {
    const testCases = [
      { value: 'Freezing', color: 'cyan' },
      { value: 'Bracing', color: 'cyan' },
      { value: 'Chilly', color: 'cyan' },
      { value: 'Mild', color: 'green' },
      { value: 'Balmy', color: 'green' },
      { value: 'Cool', color: 'green' },
      { value: 'Warm', color: 'orange' },
      { value: 'Hot', color: 'orange' },
      { value: 'Sweltering', color: 'red' },
      { value: 'Scorching', color: 'red' },
      { value: 'Other', color: '' },
      { value: undefined, color: '' },
    ];

    testCases.forEach((test) => {
      let color = component.setColor(test.value);
      expect(color).toBe(test.color);
    });
  });
});
