import {BASE, COLORS, LogoBikAir} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {PaginationBar} from "@components/PaginationBar";
import {useFilterSlides} from "@hooks/index";
import {ISlidesItem} from "@models/dto/ISlideItem";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {AuthStackScreenProps} from "@stacks/types";
import {
    onboardingScreenStyles
} from "@styles/OnboardingScreenStyles";
import {getCityNameFromGeolocation} from "@utils/getUsersLocation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, StatusBar, useAnimatedValue, View, ViewProps} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import {ICarouselInstance} from "react-native-reanimated-carousel/lib/typescript/types";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import MyConfig from "../../config";
import AnimatedValue = Animated.AnimatedValue;
import {ButtonsSkipAndNext} from "@components/OnBoarding/ButtonsSkipAndNext";
import {PageView} from "@components/OnBoarding/PageView";
import { getPosition } from "@utils/helpers";

interface BottomPartProps {
    animatedValue: AnimatedValue;
    lastSlides: number;
    onNext: () => void
    onPhone: () => void
}

const Buttons = ({animatedValue, lastSlides, onNext, onPhone}: BottomPartProps) => {
    const [index, setIndex] = useState(0);
    const {t} = useTranslation();

    useEffect(() => {
        const listenerId = animatedValue.addListener(({value}) => {
            setIndex(value);
        });
        return () => {
            animatedValue.removeListener(listenerId);
        };
    }, [animatedValue]);

    return <ButtonsSkipAndNext index={index} lastSlides={lastSlides} onPhone={onPhone} onNext={onNext} />;
};

interface OnBoardingScreenProps extends ViewProps, AuthStackScreenProps<"Intro"> {
}

const OnBoardingScreen = ({navigation}: OnBoardingScreenProps) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const progressValue = useAnimatedValue(0);
    const sharedValue = useSharedValue(0);
    const insets = useSafeAreaInsets();
    const [slides, setSlides] = useState<ISlidesItem[]>([]);
    const [lastSlides, setLastSlides] = useState(0);
    const [locale, setLocale] = useState("fr");
    const [cityName, setCityName] = useState("");
    const {i18n} = useTranslation();
    const filteredSlides = useFilterSlides(cityName, slides);
    const {googleGeocodingApiKey} = MyConfig;

    const handleNext = () => {
        if (carouselRef.current && carouselRef.current.getCurrentIndex() < lastSlides) {
            carouselRef.current.scrollTo({
                index: carouselRef.current.getCurrentIndex() + 1,
                animated: true,
            });
        }
    };

    const handlePhone = () => {
        navigation.navigate("Phone");
    };

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "OnBoardingScreen").then(r => console.log(r));
    }, []));

    useEffect(() => {
        const slides: ISlidesItem[] = [
            {
                id: 0,
                title: "tutorial.slide1.title",
                description: "tutorial.slide1.description",
                image: require("../assets/images/bike.png"),
                backgroundImage: require("../assets/images/background1.png")
            },
            {
                id: 1,
                title: "tutorial.slide2.title",
                description: "tutorial.slide2.description",
                image: require("../assets/images/cadenas_ouvert.png"),
                backgroundImage: require("../assets/images/background2.png")
            },
            {
                id: 2,
                title: "tutorial.slide3.title",
                description: "tutorial.slide3.description",
                image: locale === "fr" ? require("@assets/images/map_spot_fr.png") : require("@assets/images/map_spot_en.png"),
                backgroundImage: require("../assets/images/background1.png")
            },
            {
                id: 3,
                title: "tutorial.slide4.title",
                description: "tutorial.slide4.description",
                image: locale === "fr" ? require("../assets/images/tarif_fr.png") : require("../assets/images/tarif_en.png"),
                backgroundImage: require("../assets/images/background2.png")
            },
            {
                id: 4,
                title: "tutorial.slide5.title",
                description: "tutorial.slide5.description",
                image: require("../assets/images/Chrono.png"),
                backgroundImage: require("../assets/images/background2.png")
            },
            {
                id: 5,
                title: "tutorial.slide6.title",
                description: "tutorial.slide6.description",
                image: locale === "fr" ? require("../assets/images/parking-spot.png") : require("../assets/images/parking-spot-en.png"),
                backgroundImage: require("../assets/images/background2.png")
            }
        ];
        setSlides(slides);
        setLastSlides(filteredSlides.length === 0 ? 0 : filteredSlides.length - 1);
    }, [filteredSlides.length, locale]);

    useEffect(() => {
        const newLocale = i18n.language === "fr" ? "fr" : "en";
        setLocale(newLocale);
    }, [i18n.language]);

    useEffect(() => {
        // Function to get user's geolocation
        getPosition(2000, 1000)
            .then((locations: any) => {
                const userLatitude = locations.coords.latitude;
                const userLongitude = locations.coords.longitude;

                // Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
                getCityNameFromGeolocation(userLatitude, userLongitude, googleGeocodingApiKey)
                    .then(cityName => {
                        setCityName(cityName);
                    })
                    .catch(error => console.log("Error fetching city name:", error));
            })
            .catch(error => console.log("Error getting geolocation:", error));
    }, []);

    return (
        <View style={onboardingScreenStyles.container}>
            <StatusBar
                backgroundColor={COLORS.extraLightBlue}
                barStyle={"dark-content"}
            />
            <View style={{
                position: "absolute",
                top: 10 + insets.top,
                left: 0,
                right: 0,
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <ImageAtom
                    source={LogoBikAir}
                    resizeMode="contain"
                    style={onboardingScreenStyles.image}
                />
            </View>
            <Carousel
                width={BASE.window.width}
                height={BASE.window.height - 160 - insets.bottom}
                ref={carouselRef}
                data={filteredSlides}
                loop={false}
                onProgressChange={(_, absoluteProgress) => {
                    progressValue.setValue(Math.round(absoluteProgress));
                    sharedValue.value = absoluteProgress;
                }}
                renderItem={({item, index}) => <PageView key={"page-view-" + index} item={item}/>}
                customConfig={() => {
                    return {
                        viewCount: filteredSlides.length
                    };
                }}
            />
            <View style={onboardingScreenStyles.dotsContainer}>
                {/*Pagination / Dots*/}
                <View style={onboardingScreenStyles.paginateDots}>
                    <View style={onboardingScreenStyles.paginateBarContainer}>
                        {filteredSlides.map((item, index) => {
                            return <PaginationBar
                                animValue={sharedValue}
                                index={index}
                                key={"PaginationDots-" + index}
                                length={filteredSlides.length}
                            />;
                        })}
                    </View>
                </View>
                <Buttons
                    animatedValue={progressValue}
                    lastSlides={lastSlides}
                    onNext={handleNext}
                    onPhone={handlePhone}
                />
            </View>
        </View>
    );
};

export default OnBoardingScreen;
