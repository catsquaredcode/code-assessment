import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

describe('AppComponent', () => {
  let mockClient: jasmine.SpyObj<Client>;

  const dummyWeatherData1: WeatherForecast = {date: new Date(), summary: 'Scorching', temperatureC: 45, temperatureF: 112};
  const dummyWeatherData2: WeatherForecast = {date: new Date(), summary: 'Cool', temperatureC: 12, temperatureF: 53};
  const dummyWeatherData3: WeatherForecast = {date: new Date(), summary: 'Freezing', temperatureC: 1, temperatureF: 33};
  const dummyWeatherData4: WeatherForecast = {date: new Date(), summary: 'Freezing', temperatureC: -20, temperatureF: -3};
  const dummyWeatherData5: WeatherForecast = {date: new Date(), summary: 'Scorching', temperatureC: 40, temperatureF: 103};

  const dummyWeatherDatas: WeatherForecast[] = [
    dummyWeatherData1,
    dummyWeatherData2,
    dummyWeatherData3,
    dummyWeatherData4,
    dummyWeatherData5
  ];

  beforeEach(async () => {
    mockClient = jasmine.createSpyObj('Client', ['unauthenticated']);
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        {
          provide: Client,
          useValue: mockClient
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
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  it("should call client.unauthenticated and set weatherData on successful API response", () => {  
    mockClient.unauthenticated.and.returnValue(of(dummyWeatherDatas));
    TestBed.overrideProvider(Client, { useValue: mockClient });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(mockClient.unauthenticated).toHaveBeenCalled();
    expect(app.weatherData).toEqual(dummyWeatherDatas);

  });

  it('should call handleError on API error', () => {
    const errorMessage = 'An error occurred';
    mockClient.unauthenticated.and.returnValue(throwError(errorMessage));
    TestBed.overrideProvider(Client, { useValue: mockClient });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;


    spyOn(app, 'handleError');

    app.getWeather();

    expect(mockClient.unauthenticated).toHaveBeenCalled();
    expect(app.handleError).toHaveBeenCalledWith(errorMessage);
  });

});