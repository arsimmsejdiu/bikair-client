import {BASE, BlueBike, Close, COLORS, RoseBike, SIZES, YellowBike} from "@assets/index";
import {PaginationBar} from "@components/PaginationBar";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {ISpecialOffers} from "@models/dto/ISpecialOffers";
import FirstTripOffers from "@offers/FirstTripOffers";
import {useFocusEffect} from "@react-navigation/native";
import {setModal} from "@redux/reducers/notification";
import {getFirstTrip} from "@redux/reducers/trip";
import {loadData, storeData} from "@services/asyncStorage";
import {DrawerNavigationProps} from "@stacks/types";
import {specialOffersStyles} from "@styles/NewsPopupStyles";
import React, {FC, ReactElement, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Image, ScrollView, StatusBar, Text, TouchableOpacity, View, ViewProps} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import {ICarouselInstance} from "react-native-reanimated-carousel/lib/typescript/types";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface Props extends ViewProps {
    navigation: DrawerNavigationProps
}

const SpecialOffer: FC<Props> = ({navigation}): ReactElement | null => {
    const trip = useAppSelector(state => state.trip.trip);
    const modal = useAppSelector(state => state.notification.modal);
    const show = useAppSelector(state => state.notification.show);
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const progressValue = useSharedValue<number>(0);
    const refCarousel = React.useRef<ICarouselInstance>(null);

    const SpecialOffers: ISpecialOffers[] = [
        {
            id: 1,
            title: t("special_offer.title_trip") ?? "Pass 2 Trajets",
            description1: t("special_offer.description1_trip") ?? "30 min. max / trajet",
            description2: t("special_offer.description2_trip") ?? "Valables 30 jours",
            image: RoseBike,
            backgroundColor: COLORS.lightBlue,
            buttonColor: COLORS.darkBlue,
            buttonText: t("special_offer.buttonText_trip") ?? "Our Offers",
            percentTintColor: COLORS.darkBlue
        },
        {
            id: 2,
            title: t("special_offer.title_minute") ?? "Packs minutes",
            description1: t("special_offer.description1_minute") ?? "60, 120 ou 240 minutes au choix",
            description2: t("special_offer.description2_minute") ?? "Minutes décomptées à chaque trajet",
            image: BlueBike,
            backgroundColor: COLORS.yellow,
            buttonColor: COLORS.darkYellow,
            buttonText: t("special_offer.buttonText_minute") ?? "Our Offers",
            percentTintColor: COLORS.darkYellow
        },
        {
            id: 3,
            title: t("special_offer.title_subscription") ?? "Abonnement Monsuel",
            description1: t("special_offer.description1_subscription") ?? "40 trajets / mois",
            description2: t("special_offer.description2_subscription") ?? "30 minutes max / trajet",
            image: YellowBike,
            backgroundColor: COLORS.rose,
            buttonColor: COLORS.bordeau,
            buttonText: t("special_offer.buttonText_subscription") ?? "Our Offers",
            percentTintColor: COLORS.bordeau
        },
    ];

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getFirstTrip());
        }, []),
    );

    const showSpecialOfferAll = async () => {
        const alreadySeen = await loadData("@SpecialOfferAll");
        const alreadySeenBool = typeof alreadySeen === "undefined" || alreadySeen === null ? false : Boolean(alreadySeen);
        return !alreadySeenBool;
    };

    const showSpecialOfferFirstTrip = async () => {
        const alreadySeen = await loadData("@SpecialOfferFirstTrip");
        const alreadySeenBool = typeof alreadySeen === "undefined" || alreadySeen === null ? false : Boolean(alreadySeen);
        if (alreadySeenBool) {
            return false;
        } else {
            // returns true if trip
            // returns false if no trip
            return !!trip;
        }
    };

    const selectShow = async () => {
        const isShowSpecialOfferAll = await showSpecialOfferAll();
        console.log("isShowSpecialOfferAll : ", isShowSpecialOfferAll);
        if (isShowSpecialOfferAll) { //custom component
            await storeData("@SpecialOfferAll", "true");
            dispatch(setModal(true));
            return;
        }
        const isShowSpecialOfferFirstTrip = await showSpecialOfferFirstTrip();
        console.log("isShowSpecialOfferFirstTrip : ", isShowSpecialOfferFirstTrip);
        if (isShowSpecialOfferFirstTrip) { //custom component
            await storeData("@SpecialOfferFirstTrip", "true");
            dispatch(setModal(true));
            return;
        }
    };

    const handleSetModal = () => {
        if (setModal) {
            dispatch(setModal(false));
        }
    };

    useEffect(() => {
        selectShow().then(r => console.log(r));
    }, []);

    if (!modal || show) {
        return null;
    }

    return (
        <View style={specialOffersStyles.container}>
            <StatusBar
                backgroundColor={COLORS.white}
                barStyle={"dark-content"}
            />
            <TouchableOpacity
                onPress={() => handleSetModal()}
                style={{...specialOffersStyles.imageCross, top: specialOffersStyles.imageCross.top + insets.top}}
            >
                <Image source={Close} style={{width: 20, height: 20}} resizeMode={"cover"}/>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{
                paddingHorizontal: SIZES.base
            }}>
                <View style={specialOffersStyles.offerContainer}>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={specialOffersStyles.offerTitle}
                    >
                        {t("special_offer.special_offer_title")}
                    </Text>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={specialOffersStyles.offerPhrase}
                    >
                        {t("special_offer.special_offer_phrase")}
                    </Text>
                    <Carousel
                        vertical={false}
                        width={BASE.window.width * 0.90}
                        height={380}
                        loop={false}
                        ref={refCarousel}
                        style={{width: "100%"}}
                        data={SpecialOffers}
                        mode={"parallax"}
                        pagingEnabled
                        onProgressChange={(_, absoluteProgress) =>
                            (progressValue.value = absoluteProgress)
                        }
                        renderItem={({item, index}) => {
                            return (
                                <FirstTripOffers
                                    key={index}
                                    navigation={navigation}
                                    title={t(item.title ?? "special_offer.title_trip") ?? ""}
                                    description1={t(item.description1 ?? "special_offer.description1_trip") ?? ""}
                                    description2={t(item.description2 ?? "special_offer.description2_trip") ?? ""}
                                    image={item.image}
                                    backgroundColor={item.backgroundColor}
                                    buttonText={t(item.buttonText ?? "special_offer.buttonText_trip") ?? ""}
                                    buttonColor={item.buttonColor}
                                    percentTintColor={item.percentTintColor}
                                />
                            );
                        }}
                    />

                    <View style={specialOffersStyles.paginationBarContainer}>
                        {SpecialOffers.map((page, index) => {
                            return (
                                <PaginationBar
                                    animValue={progressValue}
                                    index={index}
                                    key={index}
                                    length={SpecialOffers.length}
                                />
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SpecialOffer;
