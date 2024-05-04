import {COLORS, Coupon, Send, SIZES} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {useAppDispatch} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {addDiscounts, getDiscounts} from "@redux/reducers/discount";
import {userClickDiscountValidationEvent} from "@redux/reducers/events";
import {couponButtonStyles} from "@styles/GeneralStyles";
import React, {memo, useState} from "react";
import {ActivityIndicator, Keyboard, TextInput, TouchableOpacity, View} from "react-native";
import {useTranslation} from "react-i18next";

const CouponButton = () => {
    const {i18n} = useTranslation();
    const [code, setCode] = useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();

    const locale: string = i18n.language === "fr" ? "fr" : "en";
    useFocusEffect(
        React.useCallback(() => {
            dispatch(getDiscounts());
        }, []),
    );

    React.useEffect(() => {
        dispatch(getDiscounts());
    }, []);


    const handleAddCode = (code: string | undefined) => {
        dispatch(userClickDiscountValidationEvent(code));
        if (!code) {
            return null;
        }
        Keyboard.dismiss();
        setLoading(true);
        dispatch(addDiscounts({code: code.trim()}, locale))
            .then(() => {
                dispatch(getDiscounts());
                setLoading(false);
                setCode(undefined);
            })
            .catch(() => {
                // Ignore, Redux handles the error
                setLoading(false);
            });
    };

    return (
        <View style={{paddingHorizontal: SIZES.sml}}>
            <View style={couponButtonStyles.buttonUseCookies}>
                <View style={couponButtonStyles.couponContainer}>
                    <ImageAtom source={Coupon} style={couponButtonStyles.coupons}/>
                    <TextInput
                        style={couponButtonStyles.textInput}
                        value={code}
                        onChangeText={(text: string) => setCode(text)}
                        placeholder={"Entrez votre code promo ici"}
                        placeholderTextColor={COLORS.lightGray1}
                        maxLength={30}
                        autoCapitalize={"characters"}
                    />
                </View>
                {loading ? (
                    <ActivityIndicator color={COLORS.black} size={"small"}/>
                ) : (
                    <TouchableOpacity onPress={() => handleAddCode(code)}>
                        <ImageAtom source={Send} style={couponButtonStyles.imageArrowRight}/>
                    </TouchableOpacity>
                )}
            </View>
        </View>

    );
};

export default memo(CouponButton);
