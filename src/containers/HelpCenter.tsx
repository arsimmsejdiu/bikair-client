import BikePartList from "@assets/icons/svg.json";
import {COLORS} from "@assets/index";
import {ScrollViewAtom, TextAtom} from "@components/Atom";
import {SubmitButton} from "@components/Buttons";
import CheckPermissions from "@components/CheckPermissions";
import {BikePartMolecule} from "@components/Molecule/BikePartMolecule";
import {useAppDispatch} from "@hooks/index";
import {RequestLocationPermission} from "@permissions/LocationPermission";
import {useFocusEffect} from "@react-navigation/native";
import {userClickSupportTicketEvent} from "@redux/reducers/events";
import {setPermissionError} from "@redux/reducers/initialState";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setUserPosition} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_USER_TICKET} from "@services/endPoint";
import {helpCenterStyles} from "@styles/ClusterStyles";
import {getPosition} from "@utils/helpers";
import React from "react";
import {useTranslation} from "react-i18next";
import {Keyboard, KeyboardAvoidingView, Platform, TextInput, View, ViewProps,} from "react-native";
import RNPickerSelect from "react-native-picker-select";

// Render bikePart item
interface PartSvg {
    label: string
    value: string
    sources: string
}

type HelpCenterProps = ViewProps

const HelpCenter: React.FC<HelpCenterProps> = ({
    ...props
}): React.ReactElement | null => {
    const {t} = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [bikeName, setBikeName] = React.useState<string | null>(null);
    const [issue, setIssue] = React.useState<string | null>(null);
    const [selectedPart, setSelectedPart] = React.useState<string[]>([]);
    const [description, setDescription] = React.useState<string | null>(null);
    const isBroken = issue === "Damaged bike" || issue === "Vélo endommagé";

    // Redux
    const dispatch = useAppDispatch();

    const DATA = [
        {
            id: 1,
            label: t("support.labelA"),
            value: t("support.labelA"),
        },
        {
            id: 2,
            label: t("support.labelB"),
            value: t("support.labelB"),
        },
        {
            id: 3,
            label: t("support.labelC"),
            value: t("support.labelC"),
        },
        {
            id: 4,
            label: t("support.labelD"),
            value: t("support.labelD"),
        },
    ];

    const handleSelectedPart = (part: string) => {
        const isIn = selectedPart.includes(part);
        if (isIn) {
            setSelectedPart(selectedPart.filter(el => el !== part));
        } else {
            setSelectedPart([...selectedPart, part]);
        }
    };

    const getLocation = async () => {
        try {
            const permission = await RequestLocationPermission();
            if (!permission) {
                dispatch(setPermissionError("gps"));
            }
            return await getPosition();
        } catch (err) {
            dispatch(setPermissionError("gps"));
            return null;
        }
    };

    const handleSend = async () => {
        dispatch(userClickSupportTicketEvent());
        setLoading(true);

        if (!description || !bikeName || !issue) {
            dispatch(setSnackbar({message: t("support.error"), type: "danger"}));
            setLoading(false);
            setError(true);
            return;
        }

        Keyboard.dismiss();

        try {
            // We need to send user position
            const position = await getLocation();
            if (!position?.coords) {
                return;
            }
            dispatch(setUserPosition({lat: position.coords.latitude, lng: position.coords.longitude}));


            await instanceApi.post(POST_USER_TICKET, {
                bike: bikeName,
                description: description,
                issue: issue,
                selected_part: selectedPart,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });

            setError(false);
            setBikeName(null);
            setIssue(null);
            setDescription(null);
            setSelectedPart([]);
            dispatch(setSnackbar({message: t("support.success"), type: "success"}));
        } catch (err) {
            dispatch(setSnackbar({message: t("support.error"), type: "danger"}));
        } finally {
            setLoading(false);
        }
    };

    // Fetch bikes list every 30second
    useFocusEffect(
        React.useCallback(() => {
            // Update bikes list every 30 seconds
            setBikeName(null);
            setIssue(null);
            setDescription(null);
            setSelectedPart([]);
            setError(false);
        }, []),
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={helpCenterStyles.container}
        >
            <ScrollViewAtom style={helpCenterStyles.content}>
                <View>
                    <TextAtom style={helpCenterStyles.inputLabel}>{t("support.selection")}</TextAtom>
                    <RNPickerSelect
                        value={issue}
                        style={{
                            inputAndroid: {
                                ...helpCenterStyles.inputAndroid,
                                ...{
                                    borderColor: error && !issue ? COLORS.red : COLORS.darkGrey
                                }
                            },
                            inputIOS: {
                                ...helpCenterStyles.inputIOS,
                                ...{
                                    borderColor: error && !issue ? COLORS.red : COLORS.darkGrey
                                }
                            },
                        }}
                        placeholder={{label: t("support.selectionPH"), value: null}}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value) => setIssue(value)}
                        items={DATA}
                    />
                </View>
                {
                    isBroken ?
                        <View style={helpCenterStyles.bikePartContainer}>
                            {
                                BikePartList.map((item: PartSvg, key: number) => {
                                    return <BikePartMolecule
                                        key={key}
                                        item={item}
                                        setSelectedPart={handleSelectedPart}
                                        isSelected={selectedPart.includes(item.label)}/>;
                                })
                            }
                        </View>
                        : null
                }
                <View>
                    <TextAtom style={helpCenterStyles.inputLabel}>
                        {t("support.bikeNumber")}
                    </TextAtom>
                    <TextInput
                        style={[helpCenterStyles.input, {borderColor: error && !bikeName ? COLORS.red : COLORS.darkGrey}]}
                        value={bikeName ?? ""}
                        placeholder="Ex: A0002"
                        placeholderTextColor={COLORS.inputGrey}
                        onChangeText={(text) => setBikeName(text)}
                    />
                </View>
                <View>
                    <TextAtom style={helpCenterStyles.inputLabel}>
                        {t("support.description")}
                    </TextAtom>
                    <TextInput
                        style={[helpCenterStyles.input, {borderColor: error && !description ? COLORS.red : COLORS.darkGrey}]}
                        value={description ?? ""}
                        placeholder={t("support.descriptionPH") ?? "Décrivez le problème que vous rencontrez"}
                        placeholderTextColor={COLORS.inputGrey}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
                <View style={helpCenterStyles.buttonContainer}>
                    <SubmitButton
                        disabled={loading}
                        inProgress={loading}
                        onClick={() => handleSend()}
                        value={t("support.send")}
                        actionLabel={"SUBMIT_SUPPORT_TICKET"}
                    />
                </View>
                <CheckPermissions/>
            </ScrollViewAtom>
        </KeyboardAvoidingView>
    );
};

export default HelpCenter;
