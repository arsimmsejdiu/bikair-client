import {Percentage} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch} from "@hooks/index";
import {setModal} from "@redux/reducers/notification";
import {DrawerNavigationProps} from "@stacks/types";
import {firstTripOffersStyles} from "@styles/NewsPopupStyles";
import React from "react";
import {View, ViewProps} from "react-native";

interface Props extends ViewProps {
    navigation: DrawerNavigationProps
    title?: string,
    description1?: string,
    description2?: string,
    image?: any,
    backgroundColor?: string,
    buttonColor?: string,
    buttonTextColor?: string
    buttonText?: string
    percentTintColor?: string
}

const FirstTripOffers: React.FC<Props> = ({
    navigation,
    title,
    description1,
    description2,
    image,
    backgroundColor,
    buttonColor,
    buttonText,
    percentTintColor,
}): React.ReactElement | null => {
    const dispatch = useAppDispatch();

    const handleRouting = async () => {
        dispatch(setModal(false));
        navigation.navigate("Subscription");
    };

    return (
        <View style={[firstTripOffersStyles.modalView, {backgroundColor: backgroundColor,}]}>
            <ImageAtom source={Percentage} style={{
                position: "absolute",
                bottom: 70,
                right: 10,
                width: 200,
                height: 200,
                tintColor: percentTintColor,
                opacity: 0.3
            }}/>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                height: 150
            }}>
                <ImageAtom
                    style={{
                        width: 200,
                        height: 200
                    }}
                    source={image}
                    resizeMode={"contain"}
                />
            </View>
            <View style={firstTripOffersStyles.titleContainer}>
                <TextAtom
                    adjustsFontSizeToFit numberOfLines={1}
                    style={firstTripOffersStyles.title}>
                    {title}
                </TextAtom>
            </View>
            <TextAtom adjustsFontSizeToFit numberOfLines={1} style={firstTripOffersStyles.description}>
                &#x2022; {description1}
            </TextAtom>
            <TextAtom adjustsFontSizeToFit numberOfLines={1} style={firstTripOffersStyles.description}>
                &#x2022; {description2}
            </TextAtom>
            <View style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20
            }}>
                <TextButton
                    buttonContainerStyle={firstTripOffersStyles.buttonContainerStyle}
                    label={buttonText}
                    actionLabel={"OFFER_GO_TO_PRODUCT"}
                    onPress={() => handleRouting()}
                />
            </View>
        </View>
    );
};

export default FirstTripOffers;
