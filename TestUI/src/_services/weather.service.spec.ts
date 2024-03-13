import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Weather } from 'src/_models/weather.model';
import { WeatherService } from './weather.service';


describe('WeatherService', () => {

  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the same length as output', () => {
    service.getWeather(10).subscribe((data: Weather[]) => {
      expect(data).toHaveSize(10);
    });
  });

});
