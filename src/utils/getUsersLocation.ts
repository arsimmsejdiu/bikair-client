import {instanceApi} from "@services/axiosInterceptor";

export const getCityNameFromGeolocation = async (latitude: any, longitude: any, apiKey: any) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
        const response = await instanceApi.get(apiUrl);

        if (response.data && response.data.results && response.data.results.length > 0) {
            const addressComponents = response.data.results[0].address_components;

            // Find the city name in the address components
            return addressComponents.find((component: any) =>
                component.types.includes("locality")
            )?.long_name;
        } else {
            return null; // Geocoding response is empty or invalid
        }
    } catch (error) {
        console.log("Error fetching city name:", error);
        return null; // Error occurred during geocoding request
    }
};

