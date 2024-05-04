import PrimaryButton from "@components/PrimaryButton";
import React from "react";
import {useTranslation} from "react-i18next";
import {Linking, ViewProps} from "react-native";

type Props = ViewProps

const AppSettingsButton: React.FC<Props> = (): React.ReactElement => {
    const {t} = useTranslation();

    const handleSettingOpen = async () => {
        await Linking.openSettings();
    };

    return <PrimaryButton
        onClick={handleSettingOpen}
        value={t("permission_error.button")}
        border='square'
        variant="contained_darkGrey"
    />;
};

export default AppSettingsButton;
