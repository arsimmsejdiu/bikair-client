import {Bicycle, COLORS} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {setTripState} from "@redux/reducers/trip";
import {HomeNavigationProps} from "@stacks/types";
import {notFoundContentStyle, usedContentStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense} from "react";
import {useTranslation} from "react-i18next";
import {Text, View, ViewProps} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const BikeExperimentationContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const bikeName = useAppSelector(state => state.bike.name);
    const dispatch = useAppDispatch();

    const continueTrip = () => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_BEGIN_CHECK));
        navigation.navigate("TripSteps");
    };

    return <View style={notFoundContentStyle.container}>
        <FadeInView>
            <ImageAtom style={notFoundContentStyle.image} source={Bicycle} resizeMode={"cover"}/>
        </FadeInView>
        <FadeInView>
            <View style={notFoundContentStyle.descContainer}>
                <TextAtom
                    style={usedContentStyles.message}>
                    {t("bike.status.experimentation.message")}
                </TextAtom>
                <TextAtom
                    style={notFoundContentStyle.message}>
                    {t("bike.status.experimentation.description")} <Text
                        style={{color: COLORS.lightBlue}}>{bikeName}</Text> {t("bike.status.experimentation.description1")}
                </TextAtom>
            </View>
        </FadeInView>
        <Suspense fallback={<View></View>}>
            <TextButton
                label={t("bike.status.experimentation.button") ?? "Done"}
                actionLabel={"EXPERIMENTAL_BIKE"}
                buttonContainerStyle={notFoundContentStyle.textButton}
                onPress={continueTrip}
            />
        </Suspense>
    </View>;
};

export default BikeExperimentationContent;
