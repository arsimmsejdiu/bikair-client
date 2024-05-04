import {FeatherIcon, FONTS} from "@assets/index";
import {useAppSelector} from "@hooks/index";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Text, TouchableOpacity, View, ViewProps} from "react-native";
import {useToast} from "react-native-toast-notifications";

type Props = ViewProps

const SnackBar: React.FC<Props> = (): React.ReactElement | null => {
    // Redux
    const snackbar = useAppSelector(state => state.snackbar);
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const toast = useToast();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        if (snackbar.message && snackbar.timestamp && lastTimestamp < snackbar.timestamp) {
            setLastTimestamp(snackbar.timestamp);
            let messageTranslate = snackbar.message;
            if (i18n.exists(snackbar.message)) {
                messageTranslate = t(snackbar.message);
            }
            let actionLabel = "Fermer";
            if (i18n.exists("notification-screen.hide")) {
                actionLabel = t("notification-screen.hide");
            }
            const id = toast.show((
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={{
                        flexWrap: "wrap",
                        color: "white",
                        ...FONTS.h5
                    }}>
                        {messageTranslate ?? ""}
                    </Text>
                    <TouchableOpacity onPress={() => {
                        console.log("Hide notification : ", id);
                        toast.hide(id);
                    }}>
                        <FeatherIcon name={"x"} size={30} color={"white"}/>
                    </TouchableOpacity>
                </View>
            ), {
                type: snackbar.type ?? "danger",
                style: {
                    width: "100%",
                    borderRadius: 15,
                    alignItems: "center",
                },
                placement: "bottom",
                swipeEnabled: false,
            });
        }
    }, [snackbar, lastTimestamp, toast]);

    return null;
};

export default SnackBar;
