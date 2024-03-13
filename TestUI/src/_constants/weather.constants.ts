import { WeatherRange, WeatherType } from 'src/_models/weather.model';


export const WEATHER_RANGES: WeatherRange[] = [
  { min: Number.NEGATIVE_INFINITY, max: 0, type: WeatherType.FREEZING },
  { min: 0, max: 10, type: WeatherType.BRACING },
  { min: 10, max: 15, type: WeatherType.CHILLY },
  { min: 15, max: 20, type: WeatherType.MILD },
  { min: 20, max: 25, type: WeatherType.BALMY },
  { min: 25, max: 30, type: WeatherType.COOL },
  { min: 30, max: 35, type: WeatherType.WARM },
  { min: 35, max: 40, type: WeatherType.HOT },
  { min: 40, max: 45, type: WeatherType.SWELTERING },
  { min: 45, max: Number.POSITIVE_INFINITY, type: WeatherType.SCORCHING }
];
