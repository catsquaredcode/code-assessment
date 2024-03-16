import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Client, WeatherForecast } from './weatherapp.swagger';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let mockClient: jasmine.SpyObj<Client>;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
      const clientSpy = jasmine.createSpyObj('Client', ['unauthenticated']);

      await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        declarations: [AppComponent],
        providers: [{ provide: Client, useValue: clientSpy }],
      }).compileComponents();

      mockClient = TestBed.inject(Client) as jasmine.SpyObj<Client>;
      httpTestingController = TestBed.inject(HttpTestingController);
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    });

   it('should create the app', () => {
      expect(component).toBeTruthy();
   });

   describe('getWeather', () => {
      it('should call client.unauthenticated and update weatherData on successful API call', () => {
        const mockData: WeatherForecast[] = [{ temperatureC: 25, temperatureF: 77, summary: 'Sunny' }];
        mockClient.unauthenticated.and.returnValue(of(mockData));

        component.getWeather();

        mockClient.unauthenticated().subscribe((weatherData)=> {
            expect(mockClient.unauthenticated).toHaveBeenCalled();
            expect(weatherData).toEqual(mockData);
        });
        httpTestingController.match('/WeatherForecast/unauthenticated');
      });

   });

   describe('handleError', () => {
      it('should alert the error message', () => {
        const mockError = 'Test Error';
        spyOn(window, 'alert');

        component.handleError(mockError);

        expect(window.alert).toHaveBeenCalledWith(mockError);
      });
   });

   it('should return cyan for freezing, bracing, and chilly summaries', () => {
     expect(component.getColor('Freezing')).toBe('cyan');
     expect(component.getColor('Bracing')).toBe('cyan');
     expect(component.getColor('Chilly')).toBe('cyan');
   });

   it('should return green for mild, balmy, and cool summaries', () => {
     expect(component.getColor('Mild')).toBe('green');
     expect(component.getColor('Balmy')).toBe('green');
     expect(component.getColor('Cool')).toBe('green');
   });

   it('should return orange for warm and hot summaries', () => {
     expect(component.getColor('Warm')).toBe('orange');
     expect(component.getColor('Hot')).toBe('orange');
   });

   it('should return red for sweltering and scorching summaries', () => {
     expect(component.getColor('Sweltering')).toBe('red');
     expect(component.getColor('Scorching')).toBe('red');
   });

   it('should return black for unknown summaries', () => {
     expect(component.getColor('Unknown')).toBe('black');
   });

});
