import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
 



describe('AppComponent', () => {

  let httpClient: HttpClientTestingModule;
  let httpTestingController: HttpTestingController;
  let wheaterservice: Client;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [Client],
      declarations: [
        AppComponent

      ],
    }).compileComponents();

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    wheaterservice = TestBed.inject(Client);

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

  // test web service
  it('should get WS data and expect record lenght to be 30', () => {


    const response: WeatherForecast[] = [

      // {
      //   //"date": "2023-11-20T00:00:00",
      //   "temperatureC": -12,
      //   "temperatureF": 11,
      //   "summary": "Freezing"
      // }



     ];

    wheaterservice.unauthenticated().subscribe((res) => {

      expect(res).toEqual(response);



    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: wheaterservice.getBaseUrl() + '/WeatherForecast/unauthenticated/?days=1',
    });

    req.flush(response);


  })



});
