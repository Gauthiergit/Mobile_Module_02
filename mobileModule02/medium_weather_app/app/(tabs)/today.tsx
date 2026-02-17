import { ThemedText } from '@/components/ThemedText';
import { errorTextColor, Styles, tintColor } from '@/constants/theme';
import { WEATHER_URL } from '@/constants/url';
import { getWeatherDescription, getWeatherIcon } from '@/mappers/WeatherMap';
import { useSearchlocation } from '@/providers/SearchLocationProvider';
import { HourlyWeather } from '@/types/Weather';
import { formatHour } from '@/utils/format';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export default function TodayScreen() {
	const { location, errorMessage, setErrorMessage } = useSearchlocation();
	const [loading, setLoading] = useState(false);
	const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[]>([]);

	const fetchWeatherDatas = useCallback(async () => {
		if (!location) return;
		setLoading(true);
		setErrorMessage(null);

		try {
			const params = {
				latitude: location.latitude,
				longitude: location.longitude,
				hourly: ["weather_code", "temperature_2m", "wind_speed_10m"],
				forecast_days: 1
			};

			const responses = await fetchWeatherApi(WEATHER_URL, params);
			const response = responses[0];
			const hourly = response.hourly()!;
			const utcOffsetSeconds = response.utcOffsetSeconds();

			const start = Number(hourly.time());
			const end = Number(hourly.timeEnd());
			const step = hourly.interval();

			const mapped = [];
			const tempValues = hourly.variables(1)!.valuesArray()!;
			const windValues = hourly.variables(2)!.valuesArray()!;

			for (let i = 0; i < (end - start) / step; i++) {
				const date = new Date((start + i * step + utcOffsetSeconds) * 1000);
				mapped.push({
					time: formatHour(date),
					temperature: tempValues[i],
					windSpeed: windValues[i],
					weatherCode: hourly.variables(0)!.valuesArray()![i]
				});
			}
			setHourlyWeather(mapped);
		} catch (e) {
			setErrorMessage("Service connection is lost. Please check your internet connection or try again later");
		} finally {
			setLoading(false);
		}
	}, [location]);

	useEffect(() => {
		fetchWeatherDatas();
	}, [fetchWeatherDatas])

	return (
		<View style={{ flex: 1 }}>
			{loading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color={tintColor} />
				</View>
			) : (
				<>
					{location && !errorMessage && (
						<View style={{flex: 1}}>
							<View style={styles.header}>
								<ThemedText type="title">{location.name}</ThemedText>
								<ThemedText type="title">{location.admin1}</ThemedText>
								<ThemedText type="title">{location.country}</ThemedText>
							</View>
							<ScrollView
								style={styles.scrollView}
								contentContainerStyle={styles.scrollContent}
								scrollEnabled={true}
								scrollEventThrottle={16}
							>
								{hourlyWeather.length > 0 && (
									hourlyWeather.map((weather) => (
										<View key={weather.time} style={styles.row}>
											<ThemedText>{weather.time}</ThemedText>
											<ThemedText>{weather.temperature?.toFixed(2)} °C</ThemedText>
											<ThemedText>{weather.windSpeed?.toFixed(2)} km/h</ThemedText>
											<View style={styles.weatherDescription}>
												<MaterialCommunityIcons name={getWeatherIcon(weather.weatherCode) as any} size={24} color={tintColor} />
												<ThemedText style={{ textAlign: 'center' }}>{getWeatherDescription(weather.weatherCode)}</ThemedText>
											</View>
										</View>
									))
								)}
								
							</ScrollView>
						</View>
					)}
					{errorMessage && (
						<View style={styles.error}>
							<ThemedText type="default" color={errorTextColor} style={{ textAlign: 'center' }}>{errorMessage}</ThemedText>
						</View>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		paddingHorizontal: 20
	},
	header: {
		paddingTop: 20,
		paddingBottom: 10,
		alignItems: "center"
	},
	scrollContent: {
		paddingBottom: 20
	},
	row: {
		flexDirection: 'row',
		justifyContent: "space-between",
		width: '100%',
		paddingVertical: 15,
		paddingHorizontal: 10,
		marginBottom: 5,
		alignItems: 'center'
	},
	weatherDescription: {
		maxWidth: '30%',
		minWidth: '30%',
		alignItems: "center",
		justifyContent: "center",
		flexDirection: 'column',
		gap: 8
	},
	error: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 50,
		marginLeft: 50
	}
});
