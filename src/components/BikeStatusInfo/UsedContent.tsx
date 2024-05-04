import {Used} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {HomeNavigationProps} from "@stacks/types";
import {usedContentStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const UsedContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();

    return (
        <View style={usedContentStyles.container}>
            <FadeInView>
                <ImageAtom style={usedContentStyles.image} source={Used} resizeMode={"cover"}/>
            </FadeInView>
            <FadeInView>
                <View style={usedContentStyles.descContainer}>
                    <TextAtom
                        style={usedContentStyles.message}>
                        {t("bike.status.used.message")}
                    </TextAtom>
                    <TextAtom
                        style={usedContentStyles.description}>
                        {t("bike.status.used.description")}
                    </TextAtom>
                    <TextAtom
                        style={usedContentStyles.description}>
                        {t("bike.status.used.description1")}
                    </TextAtom>
                </View>
            </FadeInView>
            <Suspense fallback={<View></View>}>
                <TextButton
                    label={t("wording.done") ?? "Done"}
                    actionLabel={"WORDING_DONE"}
                    buttonContainerStyle={usedContentStyles.textButton}
                    onPress={() => navigation.navigate("Map")}
                />
            </Suspense>
        </View>
    );
};


export default UsedContent;
