import {Berry, COLORS, SIZES} from "@assets/index";
import {TextReveal} from "@components/Animations/FadeInView";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {setBikeName, setTripState} from "@redux/reducers/trip";
import {getBikeStatus} from "@services/bikeService";
import {postUserDiscounts} from "@services/userService";
import {HomeNavigationProps} from "@stacks/types";
import {rentalContentStyles} from "@styles/BikeStatusInfoStyle";
import React, {lazy, Suspense, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ViewProps
} from "react-native";

const TextButton = lazy(() => import("@components/Molecule/TextButton"));

interface Props extends ViewProps {
    navigation: HomeNavigationProps
}

const RentalContent: React.FC<Props> = ({navigation}): React.ReactElement => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = React.useState<string | undefined>(undefined);
    const bikeName = useAppSelector(state => state.bike.name);
    const [err, setErr] = useState("");

    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const handleAddCode = (code: string | undefined) => {
        if (!code) {
            return null;
        }
        Keyboard.dismiss();
        setLoading(true);
        postUserDiscounts({code: code.trim()})
            .then(() => {
                setLoading(true);
                getBikeStatus(bikeName.trim() ?? "0")
                    .then(r => {
                        if (r === "AVAILABLE") {
                            dispatch(setBikeName(bikeName.trim()));
                            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_BEGIN_CHECK));
                            navigation.navigate("TripSteps");
                        } else {
                            setErr(t("rental.bike_unavailable") ?? "Le vélo n'est pas disponible");
                        }
                    })
                    .catch(error => {
                        if (error.status !== 404) {
                            console.log("Error -> ", error.status);
                            setErr(t("rental.error_status") ?? "Erreur lors de la récupération de status");
                        } else {
                            throw error;
                        }
                    })
                    .finally(() => setLoading(false));
            })
            .catch(() => {
                // Ignore, Redux handles the error
                setErr(t("rental.code_invalid") ?? "Le code que vous avez entré n'est pas valide, veuillez vérifier votre e-mail et réessayer");
            }).finally(() => setLoading(false));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={rentalContentStyles.container}>
                    <FadeInView>
                        <ImageAtom style={rentalContentStyles.image} source={Berry} resizeMode={"contain"}/>
                    </FadeInView>
                    <FadeInView>
                        <View style={rentalContentStyles.descContainer}>
                            <TextReveal>
                                <TextAtom style={rentalContentStyles.message}>
                                    {t("bike.status.rental.message")}
                                </TextAtom>
                            </TextReveal>
                            <TextAtom style={rentalContentStyles.description}>
                                {t("bike.status.rental.description")}
                            </TextAtom>

                            <TextAtom style={rentalContentStyles.description1}>
                                {t("bike.status.rental.description1")}
                            </TextAtom>
                        </View>
                    </FadeInView>
                    <FadeInView style={rentalContentStyles.textInput}>
                        <TextInput
                            style={rentalContentStyles.textInputText}
                            onChangeText={(text: string) => setCode(text)}
                            autoCapitalize={"characters"}
                            placeholder={t("rental.enter_code") ?? "Entrez le code"}
                            value={code}
                        />
                    </FadeInView>
                    {err ? (
                        <Text style={rentalContentStyles.invalidMessage}>
                            {err}
                        </Text>
                    ) : null}
                    <Suspense fallback={<View></View>}>
                        <TextButton
                            actionLabel={"ENTER_TO_CONTINUE"}
                            disabled={!code || loading}
                            inProgress={loading}
                            //TODO use generic translation keys. It's non sense to use translation for parking photo here. Use "wording" key for generic translations
                            label={!code ? t("rental.enter_to_continue") ?? "" : t("parking_photo.valid") ?? ""}
                            buttonContainerStyle={{
                                height: 55,
                                width: "100%",
                                marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
                                borderRadius: SIZES.padding,
                                backgroundColor: !code ? COLORS.darkGrey : COLORS.lightBlue
                            }}
                            onPress={() => handleAddCode(code)}
                        />
                    </Suspense>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default RentalContent;
