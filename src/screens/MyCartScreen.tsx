import {COLORS, SIZES} from "@assets/index";
import CartList from "@components/CartList";
import Header from "@components/Header";
import {ConfirmCheckBoxMolecule} from "@components/Molecule/ConfirmCheckBoxMolecule";
import {DetailDropdownMolecule} from "@components/Molecule/DetailDropdownMolecule";
import {FooterTotalMolecule} from "@components/Molecule/FooterTotalMolecule";
import {DepositWarningOrganism} from "@components/Organism/DepositWarningOrganism";
import {MyCardWrapperOrganism} from "@components/Organism/MyCardWrapperOrganism";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {ProductCart} from "@models/data/ProductCart";
import {useFocusEffect} from "@react-navigation/native";
import {addDiscounts} from "@redux/reducers/discount";
import {userClickDiscountValidationEvent} from "@redux/reducers/events";
import {setError, setProductInfo} from "@redux/reducers/products";
import {storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_PRODUCTS_USER} from "@services/endPoint";
import {getProductById} from "@services/productService";
import {ProductStackScreenProps} from "@stacks/types";
import {myCartScreenStyles} from "@styles/SubscriptionScreenStyles";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    Animated,
    Keyboard,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    ViewProps
} from "react-native";

import {GetProductByIdOutput, PostProductsUserInput, PostProductsUserOutput,} from "@bikairproject/shared";

interface Props extends ViewProps, ProductStackScreenProps<"MyCart"> {
}

const MyCartScreen: React.FC<Props> = ({navigation, route}): React.ReactElement => {
    const {i18n, t} = useTranslation();
    const [cart, setCart] = useState<ProductCart | null>(null);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [discountLoading, setDiscountLoading] = useState(false);
    const [code, setCode] = useState<string | undefined>(undefined);
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [typeMessage, setTypeMessage] = useState<string>("");
    const [errMessage, setErrMessage] = useState(null);

    const dispatch = useAppDispatch();
    const paymentMethod = useAppSelector(state => state.paymentMethod);
    const user = useAppSelector(state => state.auth.me);
    const functionalities = useAppSelector(state => state.auth.functionalities);
    const errorDiscount = useAppSelector(state => state.discount.error);
    const discount = useAppSelector(state => state.discount.discounts);

    const locale: string = i18n.language === "fr" ? "fr" : "en";
    const {card} = paymentMethod;
    const scrollViewRef = useRef<ScrollView>(null);


    const [description, setDescription] = useState<any>({});

    useEffect(() => {
        if (cart) {
            if (cart.variation) {
                setDescription(cart.variation.description[locale]);
            } else {
                setDescription(cart.description[locale]);
            }
        }
    }, [cart, locale]);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "MyCartScreen").then(r => console.log(r));
    }, []));

    const highlightAnimation = useRef(new Animated.Value(0)).current;
    const fadeOutAnimation = useRef(new Animated.Value(1)).current;

    const handleButtonClick = () => {
        if (!checked) {
            setIsHighlighted(true);
            Animated.timing(highlightAnimation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            }).start(() => {
                setIsHighlighted(false);
                Animated.timing(fadeOutAnimation, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false
                }).start(() => {
                    fadeOutAnimation.setValue(1);
                });
            });
        }
    };

    const highlightStyle = {
        borderColor: highlightAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [COLORS.gray, COLORS.lightBlue],
        }),
        backgroundColor: checked ? COLORS.transparent : COLORS.white,
        marginBottom: 10,
    };

    const toggleSwitch = () => {
        setChecked(previousState => !previousState);
    };

    useEffect(() => {
        if (route.params?.OfferItem) {
            setCart(route.params.OfferItem);
        }
    }, [route.params]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: any) => (
                <Header {...props} home={false} text={"Offers"} title={t("headers.my_cart")}/>
            ),
        });
    });
    //Function to scroll to th bottom
    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: true});
        }
        handleButtonClick();
    };
    const handleAddCode = (code: string | undefined) => {
        if (cart) {
            dispatch(userClickDiscountValidationEvent(code));
            if (!code) {
                return null;
            }
            Keyboard.dismiss();
            setDiscountLoading(true);
            dispatch(addDiscounts({code: code.trim()}, locale))
                .then(() => {
                    if (errorDiscount) {
                        setErrMessage(errorDiscount);
                    } else {
                        getProductById(cart.id, functionalities?.city_id).then((p: GetProductByIdOutput | null) => {
                            if (p) {
                                setCart(p);
                            }
                        });
                    }

                    setDiscountLoading(false);
                    setCode(undefined);
                })
                .catch(() => {
                    // Ignore, Redux handles the error
                    setDiscountLoading(false);
                });
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (!cart) {
                navigation.navigate("ProductError");
                dispatch(setError(t("subscription_screen.no_cart_item")));
                return;
            }
            const body: PostProductsUserInput = {
                product_id: cart.id,
                product_variation_id: cart.variation?.id,
                city_id: functionalities?.city_id ?? user?.city_id ?? 13
            };

            console.log("Buy product = ", body);

            const {data} = await instanceApi.post<PostProductsUserOutput>(POST_PRODUCTS_USER, body);

            dispatch(setProductInfo({
                from: new Date().toISOString(),
                id: cart.variation?.product_id ?? cart.id,
                price: cart.variation?.computedPrice?.discounted_amount ?? cart.computedPrice?.discounted_amount ?? 300,
                recurring: cart.recurring,
                period: cart.period,
                description: cart.variation?.description[locale]?.success_message ?? cart.description[locale]?.success_message,
            }));

            if (data.redirectUrl) {
                await storeData("@clientSecret", data.client_secret ?? "");
                navigation.navigate("Home", {
                    screen: "W3DSecure",
                    params: {
                        uri: data.redirectUrl ?? ""
                    }
                });
            } else {
                navigation.navigate("ProductSuccess");
            }
        } catch (err: any) {
            navigation.navigate("ProductError");
            dispatch(setError(err.message));
        } finally {
            setLoading(false);
        }
    };

    function renderCard() {
        return (
            <View style={myCartScreenStyles.wrapper}>
                {/* <View style={myCartScreenStyles.buttonUseCookies}>
                    <View style={myCartScreenStyles.couponContainer}>
                        <ImageAtom source={Coupon} style={myCartScreenStyles.coupons}/>
                        <TextInput
                            style={myCartScreenStyles.textInput}
                            value={code}
                            onChangeText={(text: string) => setCode(text)}
                            placeholder={t("discounts.placeholder") ?? "Entrez votre code promo ici"}
                            placeholderTextColor={COLORS.gray}
                            maxLength={30}
                            autoCapitalize={"characters"}
                            editable={!!cart}
                        />
                    </View>
                    {discountLoading ? (
                        <ActivityIndicator color={COLORS.black} size={"small"}/>
                    ) : (
                        <TouchableOpacity disabled={!code} onPress={() => handleAddCode(code)}>
                            <ImageAtom source={Send} style={myCartScreenStyles.imageArrowRight}/>
                        </TouchableOpacity>
                    )}
                </View> */}
                {/* <TextAtom style={{color: COLORS.red, textAlign: "center"}}>{errMessage}</TextAtom> */}
                <DepositWarningOrganism/>
                <MyCardWrapperOrganism navigation={navigation} route={route}/>
            </View>
        );
    }

    function renderAttention() {
        return (
            <Animated.View style={[highlightStyle, {
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: SIZES.padding,
                borderRadius: card?.last_4 ? isHighlighted ? 4 : 0 : 0,
                borderWidth: card?.last_4 ? isHighlighted ? 2 : 0 : 0
            }]}>
                {!card?.last_4 ? null : (
                    <ConfirmCheckBoxMolecule checked={checked} toggleSwitch={toggleSwitch}/>
                )}
            </Animated.View>
        );
    }

    return (
        <View style={myCartScreenStyles.myCartContainer}>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
                <CartList cart={cart}>
                    <DetailDropdownMolecule cart={cart} description={description}/>
                </CartList>
                {renderCard()}
                {renderAttention()}
            </ScrollView>
            <FooterTotalMolecule
                loading={loading}
                checked={checked}
                cart={cart}
                card={card}
                handlePayment={handlePayment}
                scrollToBottom={scrollToBottom}
            />
        </View>
    );
};

export default MyCartScreen;
