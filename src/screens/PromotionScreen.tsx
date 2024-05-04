import {COLORS, Coupon} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {addDiscounts, getDiscounts} from "@redux/reducers/discount";
import {userClickDiscountValidationEvent} from "@redux/reducers/events";
import {DrawerStackScreenProps} from "@stacks/types";
import {promotionScreenStyles} from "@styles/PromotionScreenStyles";
import React, {lazy, Suspense, useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {FlatList, Keyboard, TextInput, View, ViewProps} from "react-native";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {GetUserDiscountsData} from "@bikairproject/shared";
import {TextAtom} from "@components/Atom";
import {formatPriceWithLocale, toStringDate} from "@utils/helpers";
import {renderRental} from "@components/Organism/RentalRenderOrganism";

const ErrorMessage = lazy(() => import("@components/ErrorMessage"));
const Loader = lazy(() => import("@components/Loader"));

interface Props extends ViewProps, DrawerStackScreenProps<"Promotion"> {
}

const PromotionScreen: React.FC<Props> = (): React.ReactElement => {

    const {i18n, t} = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<string | undefined>(undefined);
    const [errMessage, setErrMessage] = useState(null);

    // Redux
    const locale: string = i18n.language === "fr" ? "fr" : "en";
    const dispatch = useAppDispatch();
    const discount = useAppSelector(state => state.discount);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getDiscounts());
        }, []),
    );

    React.useEffect(() => {
        dispatch(getDiscounts());
    }, []);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "PromotionScreen").then(r => console.log(r));
    }, []));

    const handleAddCode = (code: string | undefined) => {
        dispatch(userClickDiscountValidationEvent(code));
        if (!code) {
            return null;
        }
        Keyboard.dismiss();
        setLoading(true);
        dispatch(addDiscounts({code: code}, locale))
            .then(() => {
                if (discount.error) {
                    setErrMessage(discount.error);
                } else {
                    setLoading(false);
                    setCode(undefined);
                }
            })
            .catch(() => {
                // Ignore, Redux handles the error
                setLoading(false);
            });
    };

    const renderProgressBar = (item: any) => {
        const usageProgression = item.remaining / item.value;
        return <View style={promotionScreenStyles.progressBarContainer}>
            <TextAtom style={{color: COLORS.darkGrey}}>
                {item.remaining}{t("discounts.item.message.min_remaining")}
            </TextAtom>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
            }}>

                <View
                    style={{
                        height: 10,
                        width: "100%",
                        borderRadius: 100,
                        backgroundColor: COLORS.darkGrey,
                    }}
                >
                    <View
                        style={{
                            height: 10,
                            width: `${usageProgression * 100}%`,
                            zIndex: 99,
                            borderRadius: 100,
                            backgroundColor: COLORS.darkBlue,
                        }}
                    />
                </View>
            </View>
        </View>;
    };

    const renderItem = ({item}: any) => {
        if (typeof item.discount_id !== "undefined") {
            return renderDiscount(item);
        }
        if (typeof item.rental_order_id !== "undefined") {
            return renderRental(item);
        }
        return null;
    };

    const renderDiscount = (item: GetUserDiscountsData) => {
        return (
            <View key={`discount${item.id}`} style={promotionScreenStyles.itemContainer}>
                <View style={promotionScreenStyles.header}>
                    <TextAtom style={promotionScreenStyles.value}>
                        {item.type.includes("ABSOLUTE") ?
                            formatPriceWithLocale(item.value) : item.value
                        }&nbsp;
                        {t(`discounts.item.message.${item.type}`)}
                    </TextAtom>
                </View>
                <View style={{marginLeft: 10, marginRight: 10}}>
                    <TextAtom style={promotionScreenStyles.text}>
                        {t("discounts.item.message.beginning")}
                        {item.type.includes("ABSOLUTE") ?
                            formatPriceWithLocale(item.value) : item.value}&nbsp;
                        {t(`discounts.item.message.${item.type}`)}
                    </TextAtom>
                </View>

                {item.type === "PACK" && renderProgressBar(item)}

                <TextAtom style={{marginLeft: 10, color: COLORS.darkGrey, marginTop: 10}}>
                    {t("discounts.item.message.expired_at")}
                    {item.expired_at ? toStringDate(item.expired_at) : t("discounts.item.message.no_date")}{"\n"}
                    {t(`discounts.item.message.usage_${item.reusable && item.type !== "SPONSOR" && item.type !== "PACK" ? "multiple" : "single"}`)}
                </TextAtom>
            </View>
        );
    };

    if (discount.isFetching) {
        return <Suspense fallback={<View></View>}>
            <Loader
                color={COLORS.lightBlue}
                style={bikePhotoStyles.root}
                size={"large"}
            />
        </Suspense>;
    }

    return (
        <View style={promotionScreenStyles.container}>
            <FlatList
                keyboardShouldPersistTaps="always"
                data={discount.discounts}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item): any => item.id}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={<View style={promotionScreenStyles.content}>
                    <View style={promotionScreenStyles.buttonUseCookies}>
                        <View style={promotionScreenStyles.couponContainer}>
                            <ImageAtom source={Coupon} style={promotionScreenStyles.coupons}/>
                            <TextInput
                                style={promotionScreenStyles.textInput}
                                value={code}
                                onChangeText={(text: string) => setCode(text)}
                                placeholder={t("discounts.placeholder") ?? "Entrez votre code promo ici"}
                                placeholderTextColor={COLORS.gray}
                                maxLength={30}
                                autoCapitalize={"characters"}
                            />
                        </View>
                    </View>
                    <Suspense fallback={<View></View>}>
                        <ErrorMessage message={discount.error}/>
                    </Suspense>
                    <View style={promotionScreenStyles.buttonContainer}>
                        <SubmitButton
                            disabled={loading}
                            inProgress={loading}
                            onClick={() => handleAddCode(code?.trim())}
                            value={t("discounts.submit")}
                            actionLabel={"SUBMIT_DISCOUNT"}
                        />
                    </View>
                </View>}
            />
        </View>
    );
};

export default PromotionScreen;
