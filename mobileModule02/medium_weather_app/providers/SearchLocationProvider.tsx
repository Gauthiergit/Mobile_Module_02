import { LocationChoice } from '@/types/Location';
import React, { createContext, useState, useContext } from 'react';

// Context
interface SearchLocationContextType {
	location: LocationChoice | undefined;
	setLocation: (location: LocationChoice | undefined) => void;
	errorMessage: string | null;
	setErrorMessage: (text: string | null) => void;
}

const SearchLocationContext = createContext<SearchLocationContextType>({
	location: undefined,
	setLocation: (location: LocationChoice | undefined) => { },
	errorMessage: null,
	setErrorMessage: (text: string | null) => { }
});

// Provider
export const SearchlocationProvider = ({ children }: { children: React.ReactNode }) => {
	const [location, setLocation] = useState<LocationChoice | undefined>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	return (
		<SearchLocationContext.Provider value={{ location, setLocation, errorMessage, setErrorMessage }}>
			{children}
		</SearchLocationContext.Provider>
	);
};

// hook
export const useSearchlocation = () => useContext(SearchLocationContext);