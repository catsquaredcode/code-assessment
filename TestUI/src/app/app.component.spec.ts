import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';

const weatherData = [
  {
    summary: 'Hot', 
    temperatureC: 38, 
    temperatureF: 100, 
    dateFormatted: '2024-01-01'
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




