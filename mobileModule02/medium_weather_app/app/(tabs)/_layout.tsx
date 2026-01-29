import { Colors, tintColor } from '@/constants/theme';
import React from 'react';
import { useColorScheme } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Header } from '@/components/Header';
import { PlatformWrapper } from '@/wrappers/PlatformWrapper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SearchlocationProvider } from '@/providers/SearchLocationProvider';

export default function TabLayout() {

	const colorScheme = useColorScheme();
	const { Navigator } = createMaterialTopTabNavigator();
	const MaterialTopTabs = withLayoutContext(Navigator);

	return (
		<SearchlocationProvider>
			<PlatformWrapper>
				<Header />
				<MaterialTopTabs
					tabBarPosition="bottom"
					screenOptions={{
						tabBarActiveTintColor: tintColor,
						tabBarInactiveTintColor: 'gray',
						tabBarLabelStyle: { fontSize: 20, textTransform: 'none' },
						tabBarIndicatorStyle: { backgroundColor: tintColor, height: 2, top: 0 },
						tabBarStyle: { backgroundColor: Colors[colorScheme ?? "light"].background },
						swipeEnabled: true,
					}}>
					<MaterialTopTabs.Screen
						name="index"
						options={{
							title: 'Currently',
							tabBarIcon: ({ color }: { color: string }) => <MaterialCommunityIcons name="weather-sunset" size={30} color={color} />,
						}}
					/>
					<MaterialTopTabs.Screen
						name="today"
						options={{
							title: 'Today',
							tabBarIcon: ({ color }: { color: string }) => <FontAwesome5 name="calendar-day" size={30} color={color} />,
						}}
					/>
					<MaterialTopTabs.Screen
						name="weekly"
						options={{
							title: 'Weekly',
							tabBarIcon: ({ color }: { color: string }) => <FontAwesome5 name="calendar-week" size={30} color={color} />,
						}}
					/>
				</MaterialTopTabs>
			</PlatformWrapper>
		</SearchlocationProvider>
	);
}
