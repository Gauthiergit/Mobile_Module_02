import { ThemedText } from '@/components/ThemedText';
import { Styles } from '@/constants/theme';
import { useSearchLocalisation } from '@/providers/SearchLocalisationProvider';
import { View } from 'react-native';

export default function CurrentlyScreen() {
	const { localisation } = useSearchLocalisation();
	return (
		<View style={Styles.container}>
			<ThemedText type="title">Currently</ThemedText>
			<ThemedText type="title">{localisation}</ThemedText>
		</View>
	);
}