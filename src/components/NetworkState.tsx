import {TextAtom} from "@components/Atom/TextAtom";
import { networkStateStyles } from "@styles/TabButtonsStyles";
import React from "react";
import {View, ViewProps} from "react-native";

interface NetworkStateProps extends ViewProps {
    isOnline: boolean
}

const NetworkState: React.FC<NetworkStateProps> = ({isOnline}): React.ReactElement | null => {

    if (isOnline) return null;

    return (
        <View style={networkStateStyles.container}>
            <TextAtom style={networkStateStyles.text}>Offline</TextAtom>
        </View>
    );
};

export default NetworkState;
