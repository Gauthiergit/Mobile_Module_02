export interface LocationChoice{
	name: string;
	admin1: string;
	country: string;
	latitude: number;
	longitude: number;
	customLabel?: string;
	customValue?: string;
}

export interface GeocodingResponse {
	results: LocationChoice[];
}