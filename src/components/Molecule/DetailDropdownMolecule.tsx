import {COLORS, FONTS} from "@assets/constant";
import {TextAtom} from "@components/Atom";
import DetailsDropdown from "@components/DetailsDropdown";
import {ProductCart} from "@models/data/ProductCart";
import React from "react";

interface DetailDropdownMoleculeProps {
    cart: ProductCart | null,
    description: any
}

export const DetailDropdownMolecule = ({cart, description}: DetailDropdownMoleculeProps) => {
    return (
        <DetailsDropdown productId={cart?.id ?? null}>
            {
                (description.describe ?? []).map((el: string, index: number) => {
                    return <TextAtom
                        key={index}
                        style={{
                            color: COLORS.darkGrey, ...FONTS.h5,
                            paddingVertical: 1
                        }}>
                        &#x2022; {el}
                    </TextAtom>;
                })
            }
        </DetailsDropdown>
    );
};
