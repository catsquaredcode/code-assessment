import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { Client } from './weatherapp.swagger';
export interface WeatherForecast {
  date?: Date;
  temperatureC?: number;
  readonly temperatureF?: number;
  summary?: string | undefined;
}

const mock: WeatherForecast[] = [
  {
    date: new Date(),
    temperatureC: 30,
    temperatureF: 32 + (30 / 0.5556),
    summary: 'hot day'
  },
  {
    date: new Date(),
    temperatureC: 20,
    temperatureF: 32 + (20 / 0.5556),
    summary: 'normal day'
  },
  {
    date: new Date(),
    temperatureC: 10,
    temperatureF: 32 + (10 / 0.5556),
    summary: 'cool day'
  },
  {
    date: new Date(),
    temperatureC: 5,
    temperatureF: 32 + (5 / 0.5556),
    summary: 'cold day'
  },
  {
    date: new Date(),
    temperatureC: 0,
    temperatureF: 32 + (0 / 0.5556),
    summary: 'very cold day'
  }
]


describe('AppComponent', () => {
  const mockData = mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [Client]
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
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  it('forecast service should exist', inject([Client], (service: Client) => {
    console.log('forecast service should exist');
    expect(service).toBeTruthy();
  }));


  it('forecast service should handle call termination', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const completeSpy = spyOn(app, 'getWeather').and.callThrough();
    app.getWeather();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('forecast service should handle error callback', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const error = 'Error on retrieving data';
    spyOn(app.client, 'unauthenticated').and.returnValue(throwError(error));
    spyOn(app, 'handleError');
    app.getWeather();
    expect(app.handleError).toHaveBeenCalledWith(error);
  });


  it('forecast service should get the correct data', inject([Client], (service: Client) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.client, 'unauthenticated').and.returnValue(of(mock));
    app.getWeather();
    expect(app.weatherData).toEqual(mock);
  }));



  it('should return cyan-text class for freezing, bracing, or chilly summary conditions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getTempClass('freezing')).toEqual('cyan-text');
    expect(app.getTempClass('chilly')).toEqual('cyan-text');
    expect(app.getTempClass('bracing')).toEqual('cyan-text');
  });

  it('should return green-text class for mild, balmy, or cool summary conditions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getTempClass('balmy')).toEqual('green-text');
    expect(app.getTempClass('mild')).toEqual('green-text');
    expect(app.getTempClass('cool')).toEqual('green-text');
  });

  it('should return orange-text class for warm or hot summary conditions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getTempClass('hot')).toEqual('orange-text');
    expect(app.getTempClass('warm')).toEqual('orange-text');
  });

  it('should return red-text for class sweltering or scorching summary conditions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getTempClass('scorching')).toEqual('red-text');
    expect(app.getTempClass('sweltering')).toEqual('red-text');
  });

  it('should return empty sting for any other summary conditions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getTempClass('')).toEqual('');
    expect(app.getTempClass('Sunny')).toEqual('');
  });

});
