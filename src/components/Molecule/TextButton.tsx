import {COLORS, FONTS} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import {useAppDispatch} from "@hooks/index";
import {onButtonClick} from "@redux/reducers/events";
import {textButtonsStyles} from "@styles/TabButtonsStyles";
import React from "react";
import {ActivityIndicator, TouchableOpacity} from "react-native";

interface IProps {
    buttonContainerStyle?: any,
    disabled?: boolean,
    label?: string,
    actionLabel: string,
    labelStyle?: any,
    label2?: any,
    label2Style?: any,
    onPress?: any,
    inProgress?: boolean
}

const TextButton = (
    {
        buttonContainerStyle,
        disabled,
        label,
        actionLabel,
        labelStyle,
        label2 = "",
        label2Style,
        onPress,
        inProgress
    }: IProps) => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onPress !== "undefined" && onPress !== null && !inProgress && !disabled) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[textButtonsStyles.button, {...buttonContainerStyle}]}
            disabled={disabled}
            onPress={handleOnClick}
        >
            <TextAtom style={{color: COLORS.white, ...FONTS.h3, ...labelStyle}}>
                {
                    inProgress ?
                        <ActivityIndicator
                            style={{
                                marginTop: 20,
                            }}
                            size="small"
                            color={"white"}
                        /> : label
                }
            </TextAtom>

            {label2 != 0 &&
                <TextAtom style={[textButtonsStyles.text, {...label2Style}]}>
                    ${label2}
                </TextAtom>
            }
        </TouchableOpacity>
    );
};

export default TextButton;
