import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => { //use f to only test this or x to exclude this  test

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
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  });
  
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should contain a 'weatherData'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.weatherData).toContain({ //toEqual
      date: new Date(),
      temperatureC: 27,
      temperatureF: 77,
      summary: " Freezing"
    })
  });

  it('should handle error', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(window, 'alert');
    const error = 'test error';

    app.handleError(error);

    expect(window.alert).toHaveBeenCalledWith(error);
  });

  it('should change text to cyan', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.changeToCyan('Freezing day')).toBeTrue();
    expect(app.changeToCyan('Chilly day')).toBeTrue();
    expect(app.changeToCyan('Hot day')).toBeFalse();
  });

  it('should change text to green', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.changeToGreen('Cool day')).toBeTrue();//it can also be -> .toBe(true);
    expect(app.changeToGreen('Mild day')).toBeTrue();
    expect(app.changeToGreen('Hot day')).toBeFalse();
  });

  it('should change text to orange', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.changeToOrange('Warm day')).toBeTrue();
    expect(app.changeToOrange('Hot day')).toBeTrue();
    expect(app.changeToOrange('Cool day')).toBeFalse();
  });

  it('should change text to red', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.changeToRed('Sweltering day')).toBeTrue();
    expect(app.changeToRed('Scorching day')).toBeTrue();
    expect(app.changeToRed('Cool day')).toBeFalse();
  });
  
});
