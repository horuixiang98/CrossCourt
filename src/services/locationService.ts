import { Configuration, GeocodingApi } from '@stadiamaps/api';
import * as ExpoLocation from 'expo-location';

// Initialize Stadia Maps API with API key
const config = new Configuration({ 
    apiKey: process.env.EXPO_PUBLIC_STADIA_API_KEY || ""
});
const geocodingApi = new GeocodingApi(config);

export interface Coordinate {
    latitude: number;
    longitude: number;
    name: string;
    gid: string;
    layer: string;
    label: string;
    coarseLocation: string;
    street: string;
    city: string;
    region: string;
    country: string;
    postalcode: string;
    distance?: number;
}

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371.0; // Radius of Earth in kilometers
    const toRad = (val: number) => val * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const l1 = toRad(lat1);
    const l2 = toRad(lat2);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(l1) * Math.cos(l2) *
              Math.sin(dLon / 2) ** 2;
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const mapStadiaFeature = (feature: any): Coordinate => {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [0, 0];
    
    return {
        latitude: coords[1],
        longitude: coords[0],
        name: props.name || "",
        gid: props.gid || "",
        layer: props.layer || "",
        label: props.formatted_address_line || props.label || props.name || "",
        coarseLocation: props.coarse_location || "",
        street: props.address_components?.street || props.street || "",
        city: props.context?.whosonfirst?.locality?.name || props.locality || "",
        region: props.context?.whosonfirst?.region?.name || props.region || "",
        country: props.context?.whosonfirst?.country?.name || props.country || "",
        postalcode: props.address_components?.postal_code || props.postalcode || "",
    };
};

export const whereAmI = async () => {
    try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return null;
        }

        const location = await ExpoLocation.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };
    } catch (error) {
        console.error("Error getting current location:", error);
        return null;
    }
}

export const getCoordinates = async (query: string, limit: number = 5): Promise<Coordinate[]> => {
    if (!query || query.length < 2) {
        return [];
    }
    
    // Get current location for biasing results
    const currentLocation = await whereAmI();
    
    try {
        // Use search API instead of autocomplete for more complete results
        const response = await geocodingApi.search({
            text: query,
            lang: "en",
            size: limit,
            layers: ["venue", "address"],
            // Bias results toward current location if available
            ...(currentLocation && {
                focusPointLat: currentLocation.latitude,
                focusPointLon: currentLocation.longitude,
            }),
        });
        
        let results: Coordinate[] = (response.features || []).map(mapStadiaFeature);

        // Calculate distance if we have user location
        if (currentLocation) {
            console.log("Current location:", currentLocation);
            results = results.map(item => {
                console.log("Feature:", item.name, "coords:", item.latitude, item.longitude);
                const dist = haversine(currentLocation.latitude, currentLocation.longitude, item.latitude, item.longitude);
                console.log(`Distance to ${item.name}: ${dist.toFixed(2)} km`);
                return {
                    ...item,
                    distance: dist
                };
            }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        return results;
    } catch (error) {
        console.error("Error fetching coordinates from Stadia Maps:", error);
        return [];
    }
}

// Reverse geocoding - get address from coordinates
export const reverseGeocode = async (latitude: number, longitude: number): Promise<Coordinate | null> => {
    try {
        const response = await geocodingApi.reverse({
            pointLat: latitude,
            pointLon: longitude,
            lang: "en",
            size: 1,
        });

        if (response.features && response.features.length > 0) {
            return mapStadiaFeature(response.features[0]);
        }
        return null;
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        return null;
    }
}
