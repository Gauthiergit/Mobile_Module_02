import { Colors, secondaryTextColor, tintColor } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSearchlocation } from "@/providers/SearchLocationProvider";
import * as Location from 'expo-location';

export function Header() {
	const { setLocation, setErrorMessage } = useSearchlocation();
	const [ locationSearched, setLocationSearched ] = useState<string | undefined>();
	const colorScheme = useColorScheme();

	async function getCurrentLocation() {
		setErrorMessage(null);
		setLocation(undefined);
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setErrorMessage("Geolocalisation is not available");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		let latitude = location.coords.latitude.toString();
		let longitude = location.coords.longitude.toString();
		setLocation(`${latitude} ${longitude}`)
	}


	useEffect(() => {
		getCurrentLocation();
	}, [setLocation]);

	return (
		<View style={styles.header}>
			<FontAwesome name="search" size={24} color={tintColor} />
			<TextInput
				placeholder="Entez une localisation..."
				style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
				placeholderTextColor={secondaryTextColor}
				value={locationSearched}
				onChangeText={setLocationSearched}
				onSubmitEditing={() => setLocation(locationSearched)}
				returnKeyType="search"
			/>
			<Pressable
				onPress={getCurrentLocation}
				style={({ pressed }) => [
					{ opacity: pressed ? 0.5 : 1 },
					styles.button
				]}
			>
				<MaterialIcons name="gps-fixed" size={24} color={tintColor} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingTop: 60,
		paddingHorizontal: 15,
		gap: 6,
		flexDirection: "row",
		alignItems: "center"
	},
	input: {
		height: 40,
		borderColor: tintColor,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
		flex: 1,
	},
	button: {
		padding: 10,
		borderRadius: 50,
		borderColor: tintColor,
		borderWidth: 1
	},
});