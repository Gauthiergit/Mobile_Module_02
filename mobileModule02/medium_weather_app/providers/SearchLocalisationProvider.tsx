import React, { createContext, useState, useContext } from 'react';

// Context
const SearchLocalisationContext = createContext({
	localisation: "",
	setLocalisation: (text: string) => {},
});

// Provider
export const SearchLocalisationProvider = ({ children }: { children: React.ReactNode }) => {
  const [localisation, setLocalisation] = useState('');

  return (
    <SearchLocalisationContext.Provider value={{ localisation, setLocalisation }}>
      {children}
    </SearchLocalisationContext.Provider>
  );
};

// hook
export const useSearchLocalisation = () => useContext(SearchLocalisationContext);