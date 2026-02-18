import { Colors, secondaryTextColor, tintColor } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, useColorScheme, View, Platform, Keyboard } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSearchlocation } from "@/providers/SearchLocationProvider";
import * as Location from 'expo-location';
import { GeocodingResponse, LocationChoice } from "@/types/Location";
import { CustomDropdown } from "./CustomDropDown";


export function Header() {
	const { setLocation, setErrorMessage } = useSearchlocation();
	const [locationSearched, setLocationSearched] = useState<string>("");
	const [debouncedQuery, setDebouncedQuery] = useState<string>("");
	const [locationChoices, setLocationChoices] = useState<LocationChoice[]>();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const colorScheme = useColorScheme();
	const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search"

	async function getCurrentLocation() {
		setErrorMessage(null);
		setLocation(undefined);

		if (Platform.OS === 'web') {
			setErrorMessage("Geolocalisation is not available on web");
			return;
		}

		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMessage("Geolocalisation is not available. Please anable it in your App settings.");
				return;
			}
	
			let location = await Location.getCurrentPositionAsync({});
			if (location) {
				let reverseGeocode = await Location.reverseGeocodeAsync({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});
				if (reverseGeocode && reverseGeocode.length > 0) {
					const myLocation: LocationChoice = {
						name: reverseGeocode[0].city,
						admin1: reverseGeocode[0].region,
						country: reverseGeocode[0].country,
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					};
					setLocation(myLocation);
				}
			}
		} catch (error) {
			setErrorMessage("Service connection is lost. Please check your internet connection or try again later");
		}
	}

	useEffect(() => {
		const trimmed = locationSearched.trim();
		const handle = setTimeout(() => setDebouncedQuery(trimmed), 350);
		return () => clearTimeout(handle);
	}, [locationSearched]);

	useEffect(() => {
		async function getLocation() {
			if (debouncedQuery) {
				try {
					const response = await fetch(`${geocodingUrl}?name=${debouncedQuery}&count=5`, { method: "GET" });
					if (!response.ok)
						setErrorMessage("Service connection is lost. Please check your internet connection or try again later")
					else{
						const result = await response.json() as GeocodingResponse
						if (result.results && Array.isArray(result.results)) {
							const formatedData = result.results.map(choice => ({
								...choice,
								customLabel: `${choice.name} ${choice.admin1}, ${choice.country}`
							}));
							setLocationChoices(formatedData);
						}
					}
				} catch (error) {
					setErrorMessage("Service connection is lost. Please check your internet connection or try again later")
				}
			}
		}
		getLocation();
	}, [debouncedQuery]);


	useEffect(() => {
		getCurrentLocation();
	}, []);

	useEffect(() => {
		if (locationChoices && locationChoices.length > 0)
			setIsOpen(true);
	}, [locationChoices])

	const handleLocationSelection = (locationSelected: LocationChoice) => {
		setErrorMessage(null);
		if (locationSelected) {
			setLocation(locationSelected);
			setLocationChoices([]);
			setIsOpen(false);
		}
	}

	useEffect(() => {
		if (!locationSearched.trim()) {
			setLocationChoices([]);
			setIsOpen(false);
			Keyboard.dismiss();
		}
	}, [locationSearched])

	const isLocationExists = () :LocationChoice | null | undefined => {
		if (locationChoices &&
			locationChoices?.length > 0)
			return locationChoices.find(choice => 
				choice.name?.toLowerCase() === debouncedQuery.toLowerCase()
			) || null;
	}

	const handleLocationSubmit = () => {
		setErrorMessage(null);
		setIsOpen(false);
		const location = isLocationExists();
		if (location)
			setLocation(location);
		else {
			setErrorMessage("Could not find any adress for the city name you enter.")
		}
	}

	return (
		<View style={styles.header}>
			<FontAwesome name="search" size={24} color={tintColor} />
			<View style={{ flex: 1, position: 'relative' }}>
				<TextInput
					placeholder="Entrez une localisation..."
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