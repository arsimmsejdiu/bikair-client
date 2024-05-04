import HelpCenter from "@containers/HelpCenter";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {DrawerStackScreenProps} from "@stacks/types";
import React, {useCallback} from "react";
import {ViewProps} from "react-native";


interface Props extends ViewProps, DrawerStackScreenProps<"Help"> {
}

const HelpScreen: React.FC<Props> = (props): React.ReactElement => {

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "HelpScreen").then(r => console.log(r));
    }, []));

    return <HelpCenter {...props} />;
};

export default HelpScreen;


