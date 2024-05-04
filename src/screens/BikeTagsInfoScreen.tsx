import {Close} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {HomeStackScreenProps} from "@stacks/types";
import {bikeStatusInfoStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense, useCallback} from "react";
import {BackHandler, Image, ScrollView, TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {BIKE_TAGS} from "@bikairproject/shared";

const BikeExperimentationContent = lazy(() => import("@components/BikeTagsInfo/BikeExperimentationContent"));
const NotFoundContent = lazy(() => import("@components/BikeStatusInfo/NotFoundContent"));

interface BikeTagsInfoProps extends ViewProps, HomeStackScreenProps<"BikeTags"> {
}

const BikeTagsInfoScreen = ({navigation}: BikeTagsInfoProps) => {
    const tag = useAppSelector(state => state.bike.tags);
    const insets = useSafeAreaInsets();

    function renderTags(tags: string) {
        switch (tags) {
            case BIKE_TAGS.EXPERIMENTATION:
                return (
                    <Suspense fallback={<View></View>}>
                        <BikeExperimentationContent
                            navigation={navigation}
                        />
                    </Suspense>
                );

            default:
                return (
                    <Suspense fallback={<View></View>}>
                        <NotFoundContent
                            navigation={navigation}
                        />
                    </Suspense>
                );
        }
    }

    const handleBackAction = () => navigation.navigate("Map");

    const addBackHandler = useCallback(() => {
        const backAction = () => {
            handleBackAction();
            return true;
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    const logLastScreen = useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "BikeStatusInfoScreen").then(r => console.log(r));
    }, []);

    useFocusEffect(addBackHandler);
    useFocusEffect(logLastScreen);

    return (
        <View style={bikeStatusInfoStyles.frame}>
            <View style={bikeStatusInfoStyles.container}>
                <TouchableOpacity
                    onPress={() => handleBackAction()}
                    style={{
                        ...bikeStatusInfoStyles.crossContainer,
                        top: bikeStatusInfoStyles.crossContainer.top + insets.top,
                    }}>
                    <FadeInView>
                        <Image style={bikeStatusInfoStyles.imageCross} source={Close} resizeMode={"cover"}/>
                    </FadeInView>
                </TouchableOpacity>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{marginTop: 50}}>
                        {renderTags(tag)}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default BikeTagsInfoScreen;
