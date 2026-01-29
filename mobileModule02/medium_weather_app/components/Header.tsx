import { Colors, secondaryTextColor, tintColor } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSearchlocation } from "@/providers/SearchLocationProvider";
import * as Location from 'expo-location';
import { GeocodingResponse, LocationChoice } from "@/types/LocationChoice";
import {Picker} from '@react-native-picker/picker';

export function Header() {
	const { setLocation, setErrorMessage } = useSearchlocation();
	const [ locationSearched, setLocationSearched ] = useState<string | undefined>();
	const [ locationChoices, setLocationChoices ] = useState<LocationChoice[]>();
	const [ selectedLocation, setSelectedLocation ] = useState<LocationChoice>();
	const colorScheme = useColorScheme();
	const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search?name="

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
		async function getLocation() {
			const response = await fetch(geocodingUrl + locationSearched, {method: "GET"});
			if (response.ok)
			{
				const result = await response.json() as GeocodingResponse
				setLocationChoices(result.results);
			}
			else
				setErrorMessage("Can not find location.")
		}
		getLocation();
	}, [locationSearched]);


	useEffect(() => {
		getCurrentLocation();
	}, [setLocation]);

	return (
		<View style={styles.header}>
			<FontAwesome name="search" size={24} color={tintColor} />
			<View>
				<TextInput
					placeholder="Entez une localisation..."
					style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
					placeholderTextColor={secondaryTextColor}
					value={locationSearched}
					onChangeText={setLocationSearched}
					onSubmitEditing={() => setLocation(`${selectedLocation?.latitude} ${selectedLocation?.longitude}`)}
					returnKeyType="search"
				/>
				{locationChoices && (
					<Picker 
						selectedValue={selectedLocation}
						onValueChange={(itemValue, itemIndex) =>
							setSelectedLocation(itemValue)
						}
					>
						{locationChoices.map((locationChoice) => 
							<Picker.Item 
								label={`${locationChoice.name} ${locationChoice.admin1}, ${locationChoice.country}`}
								value={locationChoice}
							/>
						)}
					</Picker>
				)}
			</View>
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