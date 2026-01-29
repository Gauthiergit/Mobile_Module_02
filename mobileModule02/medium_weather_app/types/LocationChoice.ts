export interface LocationChoice{
	name: string;
	admin1: string;
	country: string;
	latitude: number;
	longitude: number;
}

export interface GeocodingResponse {
	results: LocationChoice[];
}