import {COLORS, FeatherIcon, FONTS} from "@assets/index";
import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, ViewProps} from "react-native";

interface IconTextLinkProps extends ViewProps {
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    icon?: string
    color?: string | null
    onClick: () => void
}

const IconTextLink: React.FC<IconTextLinkProps> = (
    {
        onClick,
        icon,
        color = COLORS.darkBlue,
        children
    }): React.ReactElement => {

    return (
        <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.5}>
            <View style={styles.line}>
                <FeatherIcon
                    name={icon}
                    size={18}
                    color={color}
                    style={styles.icon}
                />
                <Text style={styles.lineText}>{children}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default IconTextLink;

const styles = StyleSheet.create({
    icon: {
        marginRight: 25,
    },
    lineText: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
    },
    line: {
        flexDirection: "row",
        height: 45,
        alignItems: "center",
    },
});

