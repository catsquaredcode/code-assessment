import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WeatherClass, WeatherDescription } from './models/weather';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

  it('should return correct weather class based on weather description', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.getWeatherClass(WeatherDescription.FREEZING)).toBe(WeatherClass.CYAN);
    expect(app.getWeatherClass(WeatherDescription.BRACING)).toBe(WeatherClass.CYAN);
    expect(app.getWeatherClass(WeatherDescription.CHILLY)).toBe(WeatherClass.CYAN);
    expect(app.getWeatherClass(WeatherDescription.MILD)).toBe(WeatherClass.GREEN);
    expect(app.getWeatherClass(WeatherDescription.BALMY)).toBe(WeatherClass.GREEN);
    expect(app.getWeatherClass(WeatherDescription.COOL)).toBe(WeatherClass.GREEN);
    expect(app.getWeatherClass(WeatherDescription.WARM)).toBe(WeatherClass.ORANGE);
    expect(app.getWeatherClass(WeatherDescription.HOT)).toBe(WeatherClass.ORANGE);
    expect(app.getWeatherClass(WeatherDescription.SWELTERING)).toBe(WeatherClass.RED);
    expect(app.getWeatherClass(WeatherDescription.SCORCHING)).toBe(WeatherClass.RED);
    expect(app.getWeatherClass(undefined)).toBe('');
  });
});

