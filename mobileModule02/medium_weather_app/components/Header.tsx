import { Colors, secondaryTextColor, tintColor } from "@/constants/theme";
import { useSearchLocalisation } from "@/providers/SearchLocalisationProvider";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function Header() {
	const { setLocalisation } = useSearchLocalisation();
	const [curLocalisation, setCurLocalisation] = useState("");
	const colorScheme = useColorScheme();

	return (
		<View style={styles.header}>
			<FontAwesome name="search" size={24} color={tintColor} />
			<TextInput
				placeholder="Entez une localisation..."
				style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
				placeholderTextColor={secondaryTextColor}
				value={curLocalisation}
				onChangeText={setCurLocalisation}
				onSubmitEditing={() => setLocalisation(curLocalisation)}
				returnKeyType="search"
			/>
			<Pressable
				onPress={() => setLocalisation("Geolocation")}
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