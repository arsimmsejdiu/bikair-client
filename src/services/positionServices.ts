import {RequestLocationPermission} from "@permissions/LocationPermission";
import {getPosition} from "@utils/helpers";


export const getUserLocation = async () => {
    //Get user location
    try {
        await RequestLocationPermission();
        const position: any = await getPosition();

        if (!position || !position.coords) {
            throw "Can't get user position";
        }
        return position.coords;
    } catch (error) {
        console.log("Error while getUserLocation");
        console.log(error);
    }
};
