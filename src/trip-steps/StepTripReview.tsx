import {BASE, COLORS, FONTS, Rate} from "@assets/index";
import {SubmitButton} from "@components/Buttons";
import {StarForm} from "@components/StarForm";
import {useAppDispatch} from "@hooks/index";
import {Issues} from "@models/constants";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setHideTutorial} from "@redux/reducers/trip";
import {removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_REVIEW} from "@services/endPoint";
import React, {memo, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, View, ViewProps} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {stepTripReviewStyles} from "@styles/TripStyles";
import {TextAtom} from "@components/Atom";

interface Props extends ViewProps {
    slide?: boolean
    onStateChange: (state: TRIP_STEPS | null) => void,
    navigation: any
}

const TripReviewStep: React.FC<Props> = ({slide, onStateChange, style, navigation}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [star, setStar] = useState(0);
    const [issueSelected, setIssueSelected] = useState<Record<string, boolean>>({});
    const {t} = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const subAnim = useRef(new Animated.Value(0)).current;
    const checkBoxTitleAnim = useRef(new Animated.Value(0)).current;
    const checkBoxAnim = useRef(new Animated.Value(0)).current;
    const commentAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(150, [
            Animated.timing(viewAnim, {
                toValue: 1,
                duration: 700,
                delay: 30,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 800,
                delay: 80,
                useNativeDriver: true,
            }),
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 900,
                delay: 130,
                useNativeDriver: true,
            }),
            Animated.timing(subAnim, {
                toValue: 1,
                duration: 1000,
                delay: 180,
                useNativeDriver: true,
            }),
            Animated.timing(checkBoxTitleAnim, {
                toValue: 1,
                duration: 1100,
                delay: 230,
                useNativeDriver: true,
            }),
            Animated.timing(checkBoxAnim, {
                toValue: 1,
                duration: 1200,
                delay: 280,
                useNativeDriver: true,
            }),
            Animated.timing(translationAnim, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(commentAnim, {
                toValue: 100,
                duration: 1400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const viewAnimation = viewAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const imageAnimation = imageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const textAnimation = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const subAnimation = subAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const checkBoxAnimation = checkBoxAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const checkBoxTitleAnimation = checkBoxTitleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const translationAnimation = translationAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const commentAnimation = commentAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (star < 1) {
            return;
        }
        setLoading(true);
        try {
            if (star >= 4) {
                await storeData("@goodRating", "true");
            } else {
                await removeValue("@goodRating");
            }
            await instanceApi.post(POST_REVIEW, {
                rate: star,
                comment: comment,
                issue: Object.keys(issueSelected),
            });

            dispatch(setHideTutorial(false));
            // Reset locale state
            setComment("");
            setStar(0);
            setIssueSelected({});
            // Close modal
            onStateChange(null);
            navigation.navigate("Map");
        } catch (err) {
            // if error dispatch error message
            onStateChange(null);
            dispatch(errorOccured(err));

        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_REVIEW));
    }, []);

    const handleChange = (item: string) => {
        setIssueSelected(issueSelected => {
            const newIssueSelected = {...issueSelected};
            const checked = issueSelected[item];
            if (!checked) {
                newIssueSelected[item] = true;
            } else {
                delete newIssueSelected[item];
            }
            return newIssueSelected;
        });
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd();
        }
    };

    const renderFlatList = () => {
        return Issues.map((item, index) => {
            return (
                <Animated.View
                    key={`checkbox-issue-${index}`}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                        transform: [{translateX: checkBoxAnimation}],
                        opacity: translationAnimation
                    }}>
                    <BouncyCheckbox
                        useNativeDriver={true}
                        isChecked={issueSelected[item]}
                        onPress={() =>
                            handleChange(item)
                        }
                        fillColor={COLORS.lightBlue}
                        iconStyle={{
                            borderColor: COLORS.darkGrey,
                            borderRadius: 10,
                            height: 25,
                            width: 25,
                        }}
                        innerIconStyle={{
                            borderColor: COLORS.darkGrey,
                            borderRadius: 10,
                            height: 25,
                            width: 25,
                        }}
                        disableBuiltInState
                    />
                    <TextAtom style={{marginLeft: 10, color: COLORS.black, ...FONTS.h4}}>
                        {t(`trip_process.trip_review.issues.${item}`)}
                    </TextAtom>
                </Animated.View>
            );
        });
    };

    return (
        <View style={{
            ...stepTripReviewStyles.container,
            minHeight: BASE.window.height - insets.top - insets.bottom
        }}>
            <ScrollView>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    keyboardVerticalOffset={100}
                    behavior={"position"}
                >
                    <Animated.Image
                        style={[stepTripReviewStyles.image, {
                            transform: [{translateX: viewAnimation}],
                            opacity: translationAnimation
                        }]}
                        source={Rate}
                        resizeMode={"contain"}
                    />
                    <Animated.Text style={[stepTripReviewStyles.title, {
                        transform: [{translateX: textAnimation}],
                        opacity: translationAnimation
                    }]}>
                        {t("trip_process.trip_review.title")}
                    </Animated.Text>
                    <View style={stepTripReviewStyles.childWrapper}>
                        <Animated.Text style={[stepTripReviewStyles.text, {
                            transform: [{translateX: imageAnimation}],
                            opacity: translationAnimation
                        }]}>
                            {t("trip_process.trip_review.description")}
                        </Animated.Text>
                        <Animated.View
                            style={[
                                stepTripReviewStyles.blocStar,
                                {
                                    marginBottom: star < 4 && star > 0 ? 10 : 10,
                                    transform: [{translateX: subAnimation}],
                                    opacity: translationAnimation
                                },
                            ]}>
                            {[1, 2, 3, 4, 5].map((note, i) => {
                                return (
                                    <StarForm
                                        key={i}
                                        index={i + 1}
                                        currentNumber={star}
                                        onPress={() => setStar(note)}
                                    />
                                );
                            })}
                        </Animated.View>
                        <View>
                            {star < 4 && star > 0 ? (
                                <View style={stepTripReviewStyles.probWrapper}>
                                    <Animated.Text style={[stepTripReviewStyles.subTitle, {
                                        transform: [{translateX: checkBoxTitleAnimation}],
                                        opacity: translationAnimation
                                    }]}>
                                        {t("trip_process.trip_review.problem")}
                                    </Animated.Text>
                                    {renderFlatList()}
                                </View>
                            ) : null}
                        </View>

                        <Animated.View
                            style={[
                                stepTripReviewStyles.inputOpinionView,
                                {
                                    transform: [{translateX: subAnimation}],
                                    opacity: commentAnimation
                                },
                            ]}>
                            <KeyboardAvoidingView
                                style={stepTripReviewStyles.inputOpinion}
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                            >
                                <TextInput
                                    multiline
                                    numberOfLines={3}
                                    onChangeText={text => setComment(text)}
                                    value={comment}
                                    placeholderTextColor={COLORS.lightBlue}
                                    returnKeyType="send"
                                    blurOnSubmit={true}
                                    onSubmitEditing={handleSubmit}
                                    placeholder={t("trip_process.trip_review.placeholder") ?? "Commentaire"}
                                />
                            </KeyboardAvoidingView>
                        </Animated.View>
                    </View>
                    <View style={stepTripReviewStyles.buttonContainer}>
                        <SubmitButton
                            disabled={loading || star === 0}
                            inProgress={loading}
                            onClick={handleSubmit}
                            value={t("trip_process.trip_review.button")}
                            actionLabel={"SUBMIT_REVIEW"}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

export const StepTripReview = memo(TripReviewStep);
