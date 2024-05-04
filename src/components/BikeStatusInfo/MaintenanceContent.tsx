import {Maintenance} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {HomeNavigationProps} from "@stacks/types";
import {maintenanceContentStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const MaintenanceContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();

    return (
        <View style={maintenanceContentStyles.container}>
            <FadeInView>
                <ImageAtom style={maintenanceContentStyles.image} source={Maintenance} resizeMode={"cover"}/>
            </FadeInView>
            <FadeInView>
                <View style={maintenanceContentStyles.descContainer}>
                    <TextAtom
                        style={maintenanceContentStyles.message}>
                        {t("bike.status.maintenance.message")}
                    </TextAtom>
                    <TextAtom
                        style={maintenanceContentStyles.description}>
                        {t("bike.status.maintenance.description")}
                    </TextAtom>
                    <TextAtom
                        style={maintenanceContentStyles.description}>{"\n"}
                        {t("bike.status.maintenance.description2")}
                    </TextAtom>
                    <TextAtom
                        style={maintenanceContentStyles.description}>{"\n"}
                        {t("bike.status.maintenance.description1")}
                    </TextAtom>
                </View>
            </FadeInView>
            <Suspense fallback={<View></View>}>
                <TextButton
                    label={t("wording.done") ?? "Confirm"}
                    actionLabel={"WORDING_DONE"}
                    buttonContainerStyle={maintenanceContentStyles.textButton}
                    onPress={() => navigation.navigate("Map")}
                />
            </Suspense>
        </View>
    );
};

export default MaintenanceContent;
