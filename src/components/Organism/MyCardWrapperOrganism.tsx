import {CB, Master, RightArrow, Visa} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppSelector} from "@hooks/useAppSelector";
import {ProductStackScreenProps} from "@stacks/types";
import {myCartScreenStyles} from "@styles/SubscriptionScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View, ViewProps} from "react-native";

interface Props extends ViewProps, ProductStackScreenProps<"MyCart"> {
}

export const MyCardWrapperOrganism: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const card = useAppSelector(state => state.paymentMethod.card);

    return (
        <TouchableOpacity
            style={{width: "100%"}}
            onPress={() => navigation.navigate("Payment", {
                screen: "PaymentInfo"
            })}
        >
            <View style={myCartScreenStyles.creditCardWrapper}>
                {card?.brand === "Visa" ?
                    card?.last_4 ?
                        <ImageAtom source={Visa} style={myCartScreenStyles.imageCardVisaCB}/> :
                        <ImageAtom source={CB} style={myCartScreenStyles.imageCardVisaCB}/>
                    :
                    card?.last_4 ?
                        <ImageAtom source={Master} style={myCartScreenStyles.imageMaster}/> :
                        <ImageAtom source={CB} style={myCartScreenStyles.imageCardVisaCB}/>
                }
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <TextAtom style={myCartScreenStyles.addCardText}>
                        {card?.last_4 ? "xxxx-xxxx-xxxx-" : null}{card?.last_4 ? card?.last_4 : t("subscription_screen.add_card")}
                    </TextAtom>
                    <ImageAtom style={myCartScreenStyles.image} source={RightArrow}/>
                </View>
            </View>
        </TouchableOpacity>
    );
};
