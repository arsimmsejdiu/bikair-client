import {ISlidesItem} from "@models/dto/ISlideItem";
import {useEffect, useMemo, useState} from "react";

// Custom hook to filter the slides array based on user's city
export const useFilterSlides = (userCity: string | undefined, slides: ISlidesItem[]) => {
    const cityIdsToHide = useMemo(() => ["Leucate", "Paris", "Greme"], []); // Add the city IDs you want to hide to this array
    const [filteredSlides, setFilteredSlides] = useState<ISlidesItem[]>(slides);

    useEffect(() => {
        if (userCity !== null && userCity !== undefined) {
            // Check if userCity is not in the cityIdsToHide array
            const shouldHideLastSlide = !cityIdsToHide.includes(userCity);
            if (shouldHideLastSlide) {
                setFilteredSlides(slides.slice(0, slides.length - 1));
            } else {
                setFilteredSlides(slides);
            }
        }
    }, [userCity, slides, cityIdsToHide]);

    return filteredSlides;
};
