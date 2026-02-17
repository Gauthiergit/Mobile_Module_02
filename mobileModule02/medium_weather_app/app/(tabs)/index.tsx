import { ThemedText } from '@/components/ThemedText';
import { errorTextColor, Styles, tintColor } from '@/constants/theme';
import { useSearchlocation } from '@/providers/SearchLocationProvider';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { fetchWeatherApi } from "openmeteo"
import { CurrentWeather } from '@/types/Weather';
import { getWeatherDescription, getWeatherIcon, weatherMap } from '@/mappers/WeatherMap';
import { WEATHER_URL } from '@/constants/url';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CurrentlyScreen() {
	const { location, errorMessage, setErrorMessage} = useSearchlocation();
	const [curWeather, setCurWeather] = useState<CurrentWeather>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (location)
		{
			const fetchWeatherDatas = async () => {
				const params = {
					latitude: location?.latitude.toFixed(2),
					longitude: location?.longitude.toFixed(2),
					current: ["weather_code", "temperature_2m", "wind_speed_10m"],
				};
				setLoading(true)
				try {
					const responses = await fetchWeatherApi(WEATHER_URL, params);
					const response = responses[0];
					const current = response.current();
					const weather: CurrentWeather = {
						weatherCode: current?.variables(0)?.value(),
						temperature: current?.variables(1)?.value(),
						windSpeed: current?.variables(2)?.value()
					}
					setCurWeather(weather);
				} catch {
					setErrorMessage("Erreur lors de la demande des données")
				}
				finally
				{
					setLoading(false)
				}
			}
			fetchWeatherDatas();
		}
	}, [location, ])

	return (
		<View style={Styles.container}>
			{loading ? (
				<ActivityIndicator size="large" color={tintColor} />
			) : (
				<View>
					{curWeather && location && (
						<View style={styles.container}>
							<ThemedText type="title">{location.name}</ThemedText>
							<ThemedText type="title">{location.admin1}</ThemedText>
							<ThemedText type="title">{location.country}</ThemedText>
							<View style={styles.description}>
								<MaterialCommunityIcons name={getWeatherIcon(curWeather.weatherCode) as any} size={50} color={tintColor} />
								<ThemedText type="title" style={{ textAlign: 'center' }}>{getWeatherDescription(curWeather.weatherCode)}</ThemedText>
							</View>
							<ThemedText type="title">{curWeather.temperature?.toFixed(2)} °C</ThemedText>
							<ThemedText type="title">{curWeather.windSpeed?.toFixed(2)} km/h</ThemedText>
						</View>
					)}
					{errorMessage && (
						<ThemedText type="default" color={errorTextColor}>{errorMessage}</ThemedText>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 10
	},
	description: {
		alignItems: "center",
		justifyContent: "center",
		gap: 10
	},
});