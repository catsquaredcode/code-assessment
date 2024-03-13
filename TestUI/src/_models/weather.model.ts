export interface Weather {
  date: Date;
  readonly temperatureC: number;
  readonly temperatureF: number;
  summary: WeatherType;
}

export interface WeatherRange {
  min: number;
  max: number;
  type: WeatherType
}

export enum WeatherType {
  FREEZING = 'Freezing',
  BRACING = 'Bracing',
  CHILLY = 'Chilly',
  MILD = 'Mild',
  BALMY = 'Balmy',
  COOL = 'Cool',
  WARM = 'Warm',
  HOT = 'Hot',
  SWELTERING = 'Sweltering',
  SCORCHING = 'Scorching',
}
