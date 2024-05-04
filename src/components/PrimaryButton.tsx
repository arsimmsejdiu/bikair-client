import {BASE, COLORS, FeatherIcon} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import React from "react";
import {ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, View, ViewProps} from "react-native";

interface PrimaryButtonProps extends ViewProps {
    value: string
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    icon?: string

    inProgress?: boolean
    disabled?: boolean
    onClick?: () => void

    textColor?: keyof typeof COLORS
    iconSize?: number
    border?: "rounded" | "square"
    variant?: "outline_lightBlue" | "contained_yellow" | "contained_lightBlue" | "outline_darkGrey" | "contained_darkGrey"
    fontWeight?: TextStyle["fontWeight"]
    fontSize?: TextStyle["fontSize"]
    shadow?: boolean
    borderTopLeftRadius?: boolean
    borderTopRightRadius?: boolean
    borderBottomLeftRadius?: boolean
    borderBottomRightRadius?: boolean
    backgroundColor?: boolean
    boxShadow?: boolean
}

/**
 * variant outline_lightBlue | outline_lightBlue | contained_yellow | contained_lightBlue | outline_darkGrey | contained_darkGrey
 * border rounded | square
 * shadow true | false
 * @param {*} props
 * @returns
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = (
    {
        value,
        icon,
        textColor = "white",
        iconSize = 20,
        inProgress = false,
        disabled = false,
        onClick,
        variant = "outline_lightBlue",
        border = "rounded",
        fontWeight = "bold",
        fontSize = 15,
        shadow = false,
        borderTopLeftRadius = false,
        borderTopRightRadius = false,
        borderBottomLeftRadius = false,
        borderBottomRightRadius = false,
        backgroundColor = false,
        boxShadow = false,
        style
    }): React.ReactElement | null => {

    const handleClick = () => {
        if (typeof onClick !== "undefined" && !inProgress && !disabled) {
            onClick();
        }
    };

    return <TouchableOpacity onPress={handleClick} activeOpacity={0.8} disabled={disabled}>
        <View
            style={[
                styles.container,
                variant ? styles[variant] : {},
                border ? styles[border] : {},
                borderTopLeftRadius ? styles["border_top_left_radius"] : {},
                borderTopRightRadius ? styles["border_top_right_radius"] : {},
                borderBottomLeftRadius ? styles["border_bottom_left_radius"] : {},
                borderBottomRightRadius ? styles["border_bottom_right_radius"] : {},
                backgroundColor ? styles["background_color"] : {},
                boxShadow ? styles["box_shadow"] : {},
                shadow ? styles["shadow"] : {},
                style ?? {}
            ]}>
            {icon && !inProgress ?
                <FeatherIcon name={icon} color={COLORS[textColor]} size={iconSize} style={{marginRight: 10}}/> : null}
            <TextAtom style={{
                color: COLORS[textColor],
                fontWeight: fontWeight,
                fontSize: fontSize,
            }}>
                {
                    inProgress ?
                        <ActivityIndicator
                            style={{
                                marginTop: 20,
                            }}
                            size="small"
                            color={COLORS[textColor]}
                        />
                        : value
                }
            </TextAtom>
        </View>
    </TouchableOpacity>;
};

export default PrimaryButton;

const styles = StyleSheet.create({
    container: {
        minWidth: 200,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // padding: 20,
        height: 70
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 25
    },
    border_top_left_radius: {
        borderTopLeftRadius: 50,
    },
    border_top_right_radius: {
        borderTopRightRadius: 5,
    },
    border_bottom_right_radius: {
        borderBottomRightRadius: 50,
    },
    border_bottom_left_radius: {
        borderBottomLeftRadius: 50,
    },
    box_shadow: {
        shadowColor: "#47B2FF",
        shadowOffset: {
            width: 4,
            height: 5,
        },
        shadowOpacity: 0.25,
        elevation: 12,
    },
    background_color: {
        backgroundColor: "#47B2FF",
    },
    outline_yellow: {
        borderWidth: 1,
        borderColor: COLORS.yellow
    },
    outline_lightBlue: {
        borderWidth: 1,
        borderColor: COLORS.lightBlue,
    },
    outline_darkGrey: {
        borderWidth: 1,
        borderColor: COLORS.darkGrey,
    },
    contained_yellow: {
        backgroundColor: COLORS.yellow,
    },
    contained_lightBlue: {
        backgroundColor: COLORS.lightBlue,
    },
    contained_darkGrey: {
        backgroundColor: COLORS.darkGrey,
    },
    rounded: {
        borderRadius: 50
    },
    square: {
        borderRadius: BASE.radius.main
    }
});
