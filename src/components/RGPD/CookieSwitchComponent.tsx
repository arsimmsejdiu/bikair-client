import {TextAtom} from "@components/Atom";
import {acceptCookiesStyle} from "@styles/AcceptCookiesStyle";
import {useTranslation} from "react-i18next";
import {Switch, View} from "react-native";

interface SwitchProps {
    label: string,
    isEnabled: boolean,
    onValueChange: () => void,
    isDisabled?: boolean
}

export const CookiesSwitch = ({label, isEnabled, onValueChange, isDisabled}: SwitchProps) => {
    const {t} = useTranslation();
    return (
        <View style={acceptCookiesStyle.paragraphContainer1}>
            <TextAtom style={acceptCookiesStyle.paragraph}>
                {t(label)}
            </TextAtom>
            <Switch
                trackColor={{false: "#767577", true: "#81b0ff"}}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={isEnabled}
                disabled={isDisabled}
            />
        </View>
    );
};
