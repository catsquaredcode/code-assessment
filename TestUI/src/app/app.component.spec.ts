import { TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { Client } from "./weatherapp.swagger";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
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

  it(`should call getWeather and populate weatherData`, fakeAsync(() => {
    let clientInjectedSpy: jasmine.SpyObj<Client> = jasmine.createSpyObj('Client', { unauthenticated: of([{}, {}]) });
    const app = new AppComponent(clientInjectedSpy);
    app.getWeather();
    expect(clientInjectedSpy.unauthenticated).toHaveBeenCalled();
    expect(app.weatherData).toEqual([{}, {}])
  }));
  it("should call alert", () => {
    spyOn(window, "alert");
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.handleError('expected message');
    expect(window.alert).toHaveBeenCalledWith('expected message');
  });
});
