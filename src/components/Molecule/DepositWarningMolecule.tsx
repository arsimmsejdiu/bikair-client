import {TextAtom} from "@components/Atom";
import {myCartScreenStyles} from "@styles/SubscriptionScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";

export const DepositWarningMolecule = () => {
    const {t} = useTranslation();

    return (
        <TextAtom style={myCartScreenStyles.contentWrapper}>
            {/* {t("card_info.deposit.deposit1")} */}
            <TextAtom style={{ fontWeight: "bold", textDecorationLine: "underline"}}>
                {t("card_info.deposit.deposit2")}
            </TextAtom>
            {t("card_info.deposit.deposit3")}{"\n"}
            <TextAtom style={{
                fontWeight: "bold",
                textDecorationLine: "underline"
            }}>
                {t("card_info.deposit.deposit4")}
            </TextAtom>
        </TextAtom>
    );
};
