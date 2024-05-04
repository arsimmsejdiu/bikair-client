import {COLORS, FeatherIcon} from "@assets/index";
import {AppCamera} from "@components/AppCamera/AppCamera";
import {ScannerStyles} from "@styles/ClusterStyles";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewProps
} from "react-native";

interface Props extends ViewProps {
    loading: boolean | null,
    startNewTrip: (name: string) => void
    onBackAction: () => void
}

export const Scanner: React.FC<Props> = ({
    loading,
    startNewTrip,
    onBackAction,
}): React.ReactElement => {
    const {t} = useTranslation();
    const [bikeName, setBikeName] = useState("");

    const handleOnPress = () => {
        Keyboard.dismiss();
        if (!loading) {
            startNewTrip(bikeName);
        }
    };

    const handleProcessorResult = (results: any[]) => {
        if (results.length > 0) {
            const code = results[0];
            if (typeof code.value !== "undefined") {
                console.log(`value = ${code.value}`);
                startNewTrip(code.value);
            }
        }
    };

    return (
        <View style={ScannerStyles.container}>
            <View style={StyleSheet.absoluteFill}>
                <AppCamera
                    type={"qrcode"}
                    onProcessorResult={handleProcessorResult}
                    onBackAction={onBackAction}
                    captureEnabled={false}>
                    <KeyboardAvoidingView
                        style={[ScannerStyles.formWrapper]}
                        behavior="height"
                    >
                        <View style={[ScannerStyles.formContainer]}>
                            <View style={{width: "90%"}}>
                                <TextInput
                                    placeholder={t("start_trip.placeholder") ?? "Tapez le numéro du vélo ex : (258)"}
                                    placeholderTextColor={COLORS.darkGrey}
                                    onChangeText={setBikeName}
                                    style={ScannerStyles.textInput}
                                    onSubmitEditing={handleOnPress}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={{position: "absolute", right: 20}}>
                                <TouchableOpacity
                                    onPress={handleOnPress}>
                                    {
                                        loading ?
                                            <ActivityIndicator color={COLORS.lightBlue} size={20}/>
                                            : <FeatherIcon name={"arrow-right"} size={20} color={"black"}/>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </AppCamera>
            </View>
        </View>
    );
};

export default Scanner;

