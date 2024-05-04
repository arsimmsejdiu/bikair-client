import {COLORS, FeatherIcon} from "@assets/index";
import {ControlButton} from "@components/Buttons";
import {useAppSelector} from "@hooks/index";
import CrispChat from "@native-modules/CrispChat";
import {useFocusEffect} from "@react-navigation/native";
import {navigate} from "@services/rootNavigation";
import {helpButtonStyles} from "@styles/GeneralStyles";
import React, {useCallback, useState} from "react";
import {View, ViewProps} from "react-native";

interface Props extends ViewProps {
    centerLocation: (event: string) => void
}

const HelpButton: React.FC<Props> = ({centerLocation}): React.ReactElement => {
    const auth = useAppSelector(state => state.auth);
    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const [isCrispEnabled, setCrispEnabled] = useState(false);

    useFocusEffect(useCallback(() => {
        console.log("userFunctions?.functionalities = ", userFunctions?.functionalities);
        if (userFunctions?.functionalities && userFunctions?.functionalities.length > 0) {
            setCrispEnabled(userFunctions.functionalities.includes("CRISP_CHAT"));
            console.log("Updated value for isCrispEnabled : ", userFunctions?.functionalities.includes("CRISP_CHAT"));
        } else {
            setCrispEnabled(true);
        }
    }, [userFunctions]));

    const handleButtonPressed = () => {
        if (isCrispEnabled) {
            CrispChat.openChat();
        } else {
            navigate("Help");
        }
    };

    return (
        <View style={helpButtonStyles.container}>
            {auth.isAuthenticated && (
                <View style={[helpButtonStyles.controls, {paddingBottom: 0}]}>
                    <ControlButton onClick={handleButtonPressed} actionLabel={"OPEN_SUPPORT"}>
                        <FeatherIcon
                            name={"info"}
                            size={30}
                            color={COLORS.red}
                        />
                    </ControlButton>
                </View>
            )}
            <View style={[helpButtonStyles.controls, {paddingBottom: 0}]}>
                <ControlButton onClick={() => centerLocation("update")} actionLabel={"CENTER_MAP"}>
                    <FeatherIcon
                        name={"crosshair"}
                        size={30}
                        color={COLORS.darkGrey}
                    />
                </ControlButton>
            </View>
        </View>
    );
};

export default HelpButton;
