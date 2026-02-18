import { ThemedText } from '@/components/ThemedText';
import { errorTextColor, Styles, tintColor } from '@/constants/theme';
import { useSearchlocation } from '@/providers/SearchLocationProvider';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { fetchWeatherApi } from "openmeteo"
import { CurrentWeather } from '@/types/Weather';
import { getWeatherDescription, getWeatherIcon, weatherMap } from '@/mappers/WeatherMap';
import { WEATHER_URL } from '@/constants/url';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CurrentlyScreen() {
	const { location, errorMessage, setErrorMessage } = useSearchlocation();
	const [curWeather, setCurWeather] = useState<CurrentWeather | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchWeatherDatas = useCallback(async () => {
		if (!location) return;
		setLoading(true);
		setErrorMessage(null);

		const params = {
			latitude: location?.latitude,
			longitude: location?.longitude,
			current: ["weather_code", "temperature_2m", "wind_speed_10m"],
		};
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
			setErrorMessage("Service connection is lost. Please check your internet connection or try again later")
		}
		finally {
			setLoading(false)
		}
	}, [location]);

	useEffect(() => {
		fetchWeatherDatas();
	}, [fetchWeatherDatas])

	return (
		<Pressable style={Styles.container} onPress={() => Keyboard.dismiss()}>
			{loading ? (
				<ActivityIndicator size="large" color={tintColor} />
			) : (
				<View style={{ flex: 1 }}>
					{location && !errorMessage && (
						<View style={styles.container}>
							<ThemedText type="title">{location.name}</ThemedText>
							<ThemedText type="title">{location.admin1}</ThemedText>
							<ThemedText type="title">{location.country}</ThemedText>
							{curWeather && !errorMessage && (
								<>
									<View style={styles.description}>
										<MaterialCommunityIcons name={getWeatherIcon(curWeather.weatherCode) as any} size={50} color={tintColor} />
										<ThemedText type="title" style={{ textAlign: 'center' }}>{getWeatherDescription(curWeather.weatherCode)}</ThemedText>
									</View>
									<ThemedText type="title">{curWeather.temperature?.toFixed(2)} °C</ThemedText>
									<ThemedText type="title">{curWeather.windSpeed?.toFixed(2)} km/h</ThemedText>
								</>
							)}
						</View>
					)}
					{errorMessage && (
						<View style={styles.error}>
							<ThemedText type="default" color={errorTextColor} style={{ textAlign: 'center' }}>{errorMessage}</ThemedText>
						</View>
					)}

				</View>
			)}
		</Pressable>
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
	error: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 50,
		marginLeft: 50
	}
});