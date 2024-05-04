import Header from "@components/Header";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {TERMS_CONDITIONS} from "@services/endPoint";
import {DrawerStackScreenProps} from "@stacks/types";
import React, {useCallback, useLayoutEffect} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";
import {WebView} from "react-native-webview";

interface Props extends ViewProps, DrawerStackScreenProps<"Terms"> {
}

const Terms: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    // if the file turned on typescript do the following as below
    // place this StackHeaderProps on header: (props: StackHeaderProps) => <Header {...props} />
    // and import it from import {StackHeaderProps} from "@react-navigation/stack";

    const handleBack = () => {
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: any) => (
                <Header {...props} backAction={handleBack} home={false} title={t("headers.terms")}/>
            ),
        });
    });

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "Terms").then(r => console.log(r));
    }, []));

    return <View style={{flex: 1}}>
        <WebView
            source={{
                uri: TERMS_CONDITIONS
            }}
        />
    </View>;
};

export default Terms;
