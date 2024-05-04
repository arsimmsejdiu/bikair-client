import {Close} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {HomeStackScreenProps} from "@stacks/types";
import {bikeStatusInfoStyles} from "@styles/BikeStatusInfoStyle";
import React, {FC,lazy, Suspense, useCallback} from "react";
import {BackHandler, Image, ScrollView, TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {BIKE_STATUS} from "@bikairproject/shared";

const contentComponentMap: { [key: string]: React.LazyExoticComponent<any> } = {
    [BIKE_STATUS.RENTAL]: lazy(() => import("@components/BikeStatusInfo/RentalContent")),
    [BIKE_STATUS.USED]: lazy(() => import("@components/BikeStatusInfo/UsedContent")),
    [BIKE_STATUS.BOOKED]: lazy(() => import("@components/BikeStatusInfo/BookedContent")),
    [BIKE_STATUS.MAINTENANCE]: lazy(() => import("@components/BikeStatusInfo/MaintenanceContent")),
    default: lazy(() => import("@components/BikeStatusInfo/NotFoundContent"))
};

interface StatusContentProps {
    status: string
    navigation: HomeStackScreenProps<"BikeStatus">["navigation"]
}

const StatusContent: FC<StatusContentProps> = ({ status, navigation }) => {
    const Content = contentComponentMap[status] || contentComponentMap["default"];
    return (
        <Suspense fallback={<View></View>}>
            <Content navigation={navigation} />
        </Suspense>
    );
};

interface BikeStatusInfoProps extends ViewProps, HomeStackScreenProps<"BikeStatus"> {
}

const BikeStatusInfoScreen = ({navigation}: BikeStatusInfoProps) => {
    const status = useAppSelector(state => state.bike.status);
    const insets = useSafeAreaInsets();

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
                        <StatusContent status={status} navigation={navigation} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default BikeStatusInfoScreen;
