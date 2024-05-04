import {COLORS} from "@assets/constant";
import {TextAtom} from "@components/Atom";
import {cancelScreenStyle} from "@styles/CancelScreenStyle";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface CheckboxComponentProps {
    index: number,
    item: string;
    cancelSelected: Record<string, boolean>;
    handleChange: (item: string) => void;
}
export const CreateCheckboxComponent = ({index, item, cancelSelected, handleChange}: CheckboxComponentProps) =>  {
    const {t} = useTranslation();

    return (
        <View
            key={`checkbox-issue-${index}`}
            style={cancelScreenStyle.cancelingContainer}
        >
            <View
                style={cancelScreenStyle.checkbox}>
                <BouncyCheckbox
                    useNativeDriver={true}
                    isChecked={cancelSelected[item]}
                    onPress={() => handleChange(item)}
                    fillColor={COLORS.lightBlue}
                    iconStyle={cancelScreenStyle.iconStyle}
                    innerIconStyle={cancelScreenStyle.innerIconStyle}
                    disableBuiltInState
                />
                <TextAtom style={{marginLeft: 10, fontSize: 18}}>
                    {t(`subscription_screen.canceled_message.${item}`)}
                </TextAtom>
            </View>
        </View>
    );
}
