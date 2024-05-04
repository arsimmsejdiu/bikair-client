import {BikeYellow, Deleted, FONTS, SIZES} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import TextButton from "@components/Molecule/TextButton";
import {useFocusEffect} from "@react-navigation/native";
import {ProductStackScreenProps} from "@stacks/types";
import {deleteScreenStyle} from "@styles/CancelScreenStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, View, ViewProps} from "react-native";

interface Props extends ViewProps, ProductStackScreenProps<"ProductDeleted"> {
}

const DeleteScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
        setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => backHandler.remove();
    }, []);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "DeleteScreen").then(() => console.log(""));
    }, []));

    return (
        <View style={deleteScreenStyle.container}>
            {loading ? (
                <View style={deleteScreenStyle.contentContainerTrue}>
                    <ImageAtom
                        source={BikeYellow}
                        resizeMode="contain"
                        style={deleteScreenStyle.imageTrue}
                    />
                    <TextAtom style={deleteScreenStyle.textTrue}>
                        {t("subscription_screen.loading_cancel_purchase")}
                    </TextAtom>
                </View>
            ) : (
                <View style={deleteScreenStyle.contentContainerFalse}>
                    <ImageAtom
                        source={Deleted}
                        resizeMode="contain"
                        style={deleteScreenStyle.imageFalse}
                    />
                    <TextAtom
                        style={{marginTop: SIZES.padding, ...FONTS.h1}}>{t("subscription_screen.cancel_subscription")}!</TextAtom>
                </View>
            )}

            {loading ? null : (
                <TextButton
                    label={t("subscription_screen.close") ?? "close"}
                    actionLabel={"CLOSE_CANCEL_CONFIRM"}
                    buttonContainerStyle={deleteScreenStyle.buttonContainerStyle}
                    onPress={() => navigation.navigate("Offers")}
                />
            )}
        </View>
    );
};

export default DeleteScreen;
