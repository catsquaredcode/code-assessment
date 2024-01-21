import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { Observable, of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let mockClient: jasmine.SpyObj<Client>;

  const data1: WeatherForecast = {date: new Date(2024,1,2), summary: 'Freezing', temperatureC: -7, temperatureF: 20};
  const data2: WeatherForecast = {date: new Date(2024,1,3), summary: 'Scorching', temperatureC: 54, temperatureF: 129};
  const data3: WeatherForecast = {date: new Date(2024,1,4), summary: 'Mild', temperatureC: 15, temperatureF: 58};
  const data4: WeatherForecast = {date: new Date(2024,1,5), summary: 'Hot', temperatureC: 30, temperatureF: 85};
  const data5: WeatherForecast = {date: new Date(2024,1,6), summary: 'Freezing', temperatureC: -12, temperatureF: 11};

  const weatherDatas: WeatherForecast[] = [
    data1,data2,data3,data4,data5
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
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
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI - Webapp is running!');
  });


  it("should call unauthenticated", () => {  
    mockClient.unauthenticated.and.returnValue(of(weatherDatas));

    TestBed.overrideProvider(Client, { useValue: mockClient });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(mockClient.unauthenticated).toHaveBeenCalled();
    expect(app.weatherData).toEqual(weatherDatas);
  });

});
