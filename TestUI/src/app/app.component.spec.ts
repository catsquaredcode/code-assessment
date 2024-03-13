import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WeatherService } from 'src/_services/weather.service';
import { WeatherType } from 'src/_models/weather.model';


describe('AppComponent', () => {

  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [WeatherService]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TestUI'`, () => {
    expect(app.title).toEqual('TestUI');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('TestUI app is running!');
  });

  it('should return "text-info" class for freezing, bracing, or chilly weather', () => {
    expect(app.getWeatherClass(WeatherType.FREEZING)).toBe('text-info');
    expect(app.getWeatherClass(WeatherType.BRACING)).toBe('text-info');
    expect(app.getWeatherClass(WeatherType.CHILLY)).toBe('text-info');
  });

  it('should return "text-success" class for mild, balmy, or cool weather', () => {
    expect(app.getWeatherClass(WeatherType.MILD)).toBe('text-success');
    expect(app.getWeatherClass(WeatherType.BALMY)).toBe('text-success');
    expect(app.getWeatherClass(WeatherType.COOL)).toBe('text-success');
  });

  it('should return "text-warning" class for warm or hot weather', () => {
    expect(app.getWeatherClass(WeatherType.WARM)).toBe('text-warning');
    expect(app.getWeatherClass(WeatherType.HOT)).toBe('text-warning');
  });

  it('should return "text-danger" class for sweltering or scorching weather', () => {
    expect(app.getWeatherClass(WeatherType.SWELTERING)).toBe('text-danger');
    expect(app.getWeatherClass(WeatherType.SCORCHING)).toBe('text-danger');
  });

  it('should return undefined for unknown weather types', () => {
    expect(app.getWeatherClass('UnknownType' as WeatherType)).toBeUndefined();
  });

});
