import {COLORS} from "@assets/constant";
import {FeatherIcon} from "@assets/icons/icons";
import {TextAtom} from "@components/Atom";
import React from "react";

export const renderAddress = (address: string) => {
    if (!address) {
        return null;
    }
    return (
        <TextAtom>
            <FeatherIcon
                style={{marginRight: 5}}
                name={"map-pin"}
                size={15}
                color={COLORS.darkGrey}
            />
            &nbsp;
            {address}
        </TextAtom>
    );
};
