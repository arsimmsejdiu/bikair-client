import {COLORS} from "@assets/constant";
import {TextAtom} from "@components/Atom";
import React from "react";
import {useTranslation} from "react-i18next";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface ConfirmCheckBoxMoleculeProps {
    toggleSwitch: () => void,
    checked: boolean
}

export const ConfirmCheckBoxMolecule = ({toggleSwitch, checked}: ConfirmCheckBoxMoleculeProps) => {
    const {t} = useTranslation();

    return (
        <>
            <BouncyCheckbox
                useNativeDriver={true}
                onPress={toggleSwitch}
                isChecked={checked}
            />
            <TextAtom
                style={{
                    color: COLORS.darkGrey
                }}>
                {t("subscription_screen.confirm")}
            </TextAtom>
        </>
    );
};
