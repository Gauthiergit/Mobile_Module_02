import { Colors, secondaryTextColor, tintColor } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSearchlocation } from "@/providers/SearchLocationProvider";
import * as Location from 'expo-location';
import { GeocodingResponse, LocationChoice } from "@/types/LocationChoice";
import { CustomDropdown } from "./CustomDropDown";


export function Header() {
	const { setLocation, setErrorMessage } = useSearchlocation();
	const [locationSearched, setLocationSearched] = useState<string | undefined>();
	const [locationChoices, setLocationChoices] = useState<LocationChoice[]>();
	const [selectedLocation, setSelectedLocation] = useState<string>();
	const [isOpen, setIsOpen] = useState<boolean>(false);
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
			if (locationSearched) {
				const response = await fetch(geocodingUrl + locationSearched, { method: "GET" });
				if (response.ok) {
					const result = await response.json() as GeocodingResponse
					if (result.results && Array.isArray(result.results)) {
						const formatedData = result.results.map(choice => ({
							...choice,
							customLabel: `${choice.name} ${choice.admin1}, ${choice.country}`,
							customValue: `${choice.latitude} ${choice.longitude}`
						}));
						setLocationChoices(formatedData);
					}
				}
				else
					setErrorMessage("Can not find location.")
			}
		}
		getLocation();
	}, [locationSearched]);


	useEffect(() => {
		getCurrentLocation();
	}, [setLocation]);

	useEffect(() => {
		if (locationChoices && locationChoices.length > 0)
			setIsOpen(true);
	}, [locationChoices])

	const handleLocationSelection = (locationSelected: string) => {
		setSelectedLocation(locationSelected)
		if (selectedLocation)
		{
			setLocation(selectedLocation);
			setIsOpen(false);
		}
	}

	useEffect(() => {
		if (!locationSearched)
			setIsOpen(false);
	}, [locationSearched])

	const handleLocationSubmit = () => {
		if (selectedLocation)
			setLocation(selectedLocation);
		else {
			if (locationChoices) {
				const location = `${locationChoices[0].latitude} ${locationChoices[0].longitude}`
				setLocation(location);
			}
		}
		setIsOpen(false);
	}

	return (
		<View style={styles.header}>
			<FontAwesome name="search" size={24} color={tintColor} />
			<View style={{ flex: 1, position: 'relative' }}>
				<TextInput
					placeholder="Entez une localisation..."
					style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
					placeholderTextColor={secondaryTextColor}
					value={locationSearched}
					onChangeText={setLocationSearched}
					onSubmitEditing={handleLocationSubmit}
					returnKeyType="search"
				/>
				{isOpen && locationChoices && (
					<CustomDropdown
						data={locationChoices}
						labelKey="customLabel"
						valueKey="customValue"
						onChange={handleLocationSelection}
					/>
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
		alignItems: "center",
		overflow: 'visible',
		zIndex: 1000,
	},
	input: {
		height: 40,
		borderColor: tintColor,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	button: {
		padding: 10,
		borderRadius: 50,
		borderColor: tintColor,
		borderWidth: 1
	},
});