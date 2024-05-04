import {COLORS, LogoSplashScreen} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import React from "react";
import {ActivityIndicator, StatusBar, StyleSheet, View, ViewProps} from "react-native";

type Props = ViewProps

const SplashScreen: React.FC<Props> = (): React.ReactElement => {

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={COLORS.lightBlue}
                barStyle={"dark-content"}
            />
            <ImageAtom
                source={LogoSplashScreen}
                resizeMode={"contain"}
                style={{height: 200}}
            />
            <ActivityIndicator size="small" color="#fff" style={{marginTop: 20}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightBlue,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

export default SplashScreen;
