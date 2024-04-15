export type City = {
  geoname_id: number;
  name: string;
  cou_name_en: string;
  population: number;
  timezone: string;
  lat: number;
  lon: number;
};

export type OpenDataSoftAPIResponse = {
  data: City[];
  meta: {
    totalRowCount: number;
  };
};

export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForcastMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface ForcastWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForcastClouds {
  all: number;
}

export interface ForcastWind {
  speed: number;
  deg: number;
  gust: number;
}

export interface ForcastSys {
  pod: string;
}

export interface ForcastWeatherForecast {
  dt: number;
  main: ForcastMain;
  weather: ForcastWeather[];
  clouds: ForcastClouds;
  wind: ForcastWind;
  visibility: number;
  pop: number;
  sys: ForcastSys;
  dt_txt: string;
}

export interface FiveDayForcast {
  cod: number | string;
  message: number;
  cnt: number;
  list: ForcastWeatherForecast[];
}
