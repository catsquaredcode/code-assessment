import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Client } from './weatherapp.swagger';

describe('AppComponent', () => {

  let client: Client;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [Client]
    }).compileComponents();

    client = TestBed.inject(Client);
    http = TestBed.inject(HttpClient);

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

  it('should return a color based on description', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const forecasts = [
      { description: 'Freezing', color: 'cyan' },
      { description: 'Bracing', color: 'cyan' },
      { description: 'Chilly', color: 'cyan' },
      { description: 'Mild', color: 'green' },
      { description: 'Balmy', color: 'green' },
      { description: 'Cool', color: 'green' },
      { description: 'Warm', color: 'orange' },
      { description: 'Hot', color: 'orange' },
      { description: 'Sweltering', color: 'red' },
      { description: 'Scorching', color: 'red' },
      { description: undefined, color: 'black' },
    ];

    forecasts.forEach((forecast) => {
      let color = app.getColor(forecast.description);
      expect(color).toBe(forecast.color);
    });
  });

});
