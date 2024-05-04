import {BikeOrange, BikeYellow} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {cartLogoStyles} from "@styles/GeneralStyles";
import React from "react";
import {View} from "react-native";

interface Props {
    active: boolean,
    extraStyles?: any,
    extraImageStyle?: any
}

const CartLogo: React.FC<Props> = ({active, extraStyles = null, extraImageStyle = null}): React.ReactElement => {
    return <View style={extraStyles ? extraStyles : cartLogoStyles.logo}>
        <ImageAtom
            source={active ? BikeYellow : BikeOrange}
            resizeMode="contain"
            style={extraImageStyle ? extraImageStyle : cartLogoStyles.logoWidthHeight}
        />
    </View>;
};

export default CartLogo;
