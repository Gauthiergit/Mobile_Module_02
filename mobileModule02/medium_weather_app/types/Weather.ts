export interface CurrentWeather {
	weatherCode: number | undefined;
	temperature: number | undefined;
	windSpeed: number | undefined;
}

export interface HourlyWeather {
	time: string;
	temperature: number;
	windSpeed: number;
	weatherCode: number;
}

export interface WeeklyWeather {
	date: string;
	temperatureMax: number;
	temperatureMin: number;
	weatherCode: number;
}