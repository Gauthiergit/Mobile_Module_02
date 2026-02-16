export interface LocationChoice{
	name: string | null;
	admin1: string | null;
	country: string | null;
	latitude: number;
	longitude: number;
	customLabel?: string;
}

export interface GeocodingResponse {
	results: LocationChoice[];
}