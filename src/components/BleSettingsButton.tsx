import {useAppDispatch} from "@hooks/index";
import {clickBluetoothSettingEvent} from "@redux/reducers/events";
import React from "react";
import {useTranslation} from "react-i18next";
import {Linking, Platform, ViewProps} from "react-native";

import PrimaryButton from "./PrimaryButton";

type Props = ViewProps

const BleSettingsButton: React.FC<Props> = (props): React.ReactElement => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const handleSettingOpen = () => {
        dispatch(clickBluetoothSettingEvent());
        Platform.OS === "ios"
            ? Linking.openURL("App-Prefs:Bluetooth")
            : Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
    };

    return <PrimaryButton
        onClick={handleSettingOpen}
        value={t("permission_error.button")}
        border='square'
        variant="contained_darkGrey"
        style={props.style ?? {}}
    />;
};

export default BleSettingsButton;
