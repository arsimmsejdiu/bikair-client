import {COLORS} from "@assets/constant";
import {TextAtom} from "@components/Atom";
import React from "react";
import {useTranslation} from "react-i18next";

export const renderDiscountCode = (type: string, value: string, code: string) => {
    const {i18n, t} = useTranslation();

    if (!code) {
        return null;
    }
    let codeTranslate = code;
    if (i18n.exists(`discounts.${code}`)) {
        codeTranslate = t(`discounts.${code}`);
    }
    return (
        <TextAtom style={{color: COLORS.darkGrey}}>
            Promotion : {codeTranslate}
        </TextAtom>
    );
};
