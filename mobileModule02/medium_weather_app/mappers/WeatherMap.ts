export const weatherMap = {
	0: { texte: "Ciel dégagé", icone: "weather-sunny" },
	1: { texte: "Plutôt dégagé", icone: "weather-partly-cloudy" },
	2: { texte: "Partiellement nuageux", icone: "weather-partly-cloudy" },
	3: { texte: "Couvert", icone: "weather-cloudy" },
	45: { texte: "Brouillard", icone: "weather-fog" },
	48: { texte: "Brouillard givrant", icone: "weather-fog" },
	51: { texte: "Bruine légère", icone: "weather-rainy" },
	53: { texte: "Bruine modérée", icone: "weather-rainy" },
	55: { texte: "Bruine dense", icone: "weather-rainy" },
	56: { texte: "Bruine glaciale légère", icone: "snowflake" },
	57: { texte: "Bruine glaciale dense", icone: "snowflake" },
	61: { texte: "Pluie légère", icone: "weather-rainy" },
	63: { texte: "Pluie modérée", icone: "weather-rainy" },
	65: { texte: "Forte pluie", icone: "weather-pouring" },
	66: { texte: "Pluie verglaçante", icone: "snowflake" },
	67: { texte: "Forte pluie verglaçante", icone: "snowflake" },
	71: { texte: "Chutes de neige légères", icone: "weather-snowy" },
	73: { texte: "Chutes de neige modérées", icone: "weather-snowy" },
	75: { texte: "Fortes chutes de neige", icone: "weather-snowy" },
	77: { texte: "Grains de neige", icone: "weather-snowy" },
	80: { texte: "Averses de pluie légères", icone: "weather-pouring" },
	81: { texte: "Averses de pluie modérées", icone: "weather-pouring" },
	82: { texte: "Fortes averses de pluie", icone: "weather-pouring" },
	85: { texte: "Averses de neige", icone: "weather-snowy" },
	86: { texte: "Fortes averses de neige", icone: "weather-snowy" },
	95: { texte: "Orage", icone: "weather-lightning" },
	96: { texte: "Orage avec grêle", icone: "weather-lightning" },
	99: { texte: "Orage avec grêle abondante", icone: "weather-lightning" }
};

const isWeatherCode = (code: number): code is keyof typeof weatherMap => {
	return Object.prototype.hasOwnProperty.call(weatherMap, code);
};

export const getWeatherDescription = (weatherCode: number | undefined) => {
	if (weatherCode == undefined || !isWeatherCode(weatherCode))
		return "Undefined";
	return weatherMap[weatherCode].texte;
}

export const getWeatherIcon = (weatherCode: number | undefined) => {
	if (weatherCode == undefined || !isWeatherCode(weatherCode))
		return "❓";
	return weatherMap[weatherCode].icone;
}