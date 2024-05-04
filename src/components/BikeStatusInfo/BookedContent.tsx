import {Booked} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {HomeNavigationProps} from "@stacks/types";
import {bookedContentStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const BookedContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();

    return (
        <View style={bookedContentStyles.container}>
            <FadeInView>
                <ImageAtom style={bookedContentStyles.image} source={Booked} resizeMode={"cover"}/>
            </FadeInView>
            <FadeInView>
                <View style={bookedContentStyles.descContainer}>
                    <TextAtom
                        style={bookedContentStyles.message}>
                        {t("bike.status.booked.message")}
                    </TextAtom>
                    <TextAtom
                        style={bookedContentStyles.description}>
                        {t("bike.status.booked.description")}
                    </TextAtom>
                    <TextAtom
                        style={bookedContentStyles.description}>
                        {t("bike.status.booked.description1")}
                    </TextAtom>
                </View>
            </FadeInView>
            <Suspense fallback={<View></View>}>
                <TextButton
                    label={t("wording.done") ?? "Done"}
                    actionLabel={"WORDING_DONE"}
                    buttonContainerStyle={bookedContentStyles.textButton}
                    onPress={() => navigation.navigate("Map")}
                />
            </Suspense>
        </View>
    );
};

export default BookedContent;
