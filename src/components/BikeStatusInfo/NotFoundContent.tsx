import {COLORS, NotFound} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppSelector} from "@hooks/index";
import {HomeNavigationProps} from "@stacks/types";
import {notFoundContentStyle} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense} from "react";
import {useTranslation} from "react-i18next";
import {Text, View, ViewProps} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const NotFoundContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const bikeName = useAppSelector(state => state.bike.name);

    return <View style={notFoundContentStyle.container}>
        <FadeInView>
            <ImageAtom style={notFoundContentStyle.image} source={NotFound} resizeMode={"cover"}/>
        </FadeInView>
        <FadeInView>
            <View style={notFoundContentStyle.descContainer}>
                <TextAtom
                    style={notFoundContentStyle.message}>
                    {t("bike.status.not_found.description")} <Text
                        style={{color: COLORS.lightBlue}}>{bikeName}</Text> {t("bike.status.not_found.description1")}
                </TextAtom>
            </View>
        </FadeInView>
        <Suspense fallback={<View></View>}>
            <TextButton
                label={t("wording.done") ?? "Done"}
                actionLabel={"WORDING_DONE"}
                buttonContainerStyle={notFoundContentStyle.textButton}
                onPress={() => navigation.navigate("Map")}
            />
        </Suspense>
    </View>;
};

export default NotFoundContent;
