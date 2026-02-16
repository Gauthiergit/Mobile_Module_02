import { ThemedText } from '@/components/ThemedText';
import { errorTextColor, Styles } from '@/constants/theme';
import { useSearchlocation } from '@/providers/SearchLocationProvider';
import { View } from 'react-native';

export default function TodayScreen() {
	const { location, errorMessage} = useSearchlocation();

	return (
		<View style={Styles.container}>
			<ThemedText type="title">Today</ThemedText>
			{location && (
				<ThemedText type="default">{location.latitude} {location.longitude}</ThemedText>
			)}
			{errorMessage && (
				<ThemedText type="default" color={errorTextColor}>{errorMessage}</ThemedText>
			)}
		</View>
	);
}
