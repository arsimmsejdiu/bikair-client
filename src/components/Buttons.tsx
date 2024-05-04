import {COLORS, FeatherIcon} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import {useAppDispatch} from "@hooks/index";
import {onButtonClick} from "@redux/reducers/events";
import {ButtonsStyles} from "@styles/ButtonsStyle";
import React from "react";
import {ActivityIndicator, TouchableOpacity, View, ViewProps} from "react-native";

interface SecondaryButtonProps extends ViewProps {
    value: string,
    actionLabel: string,
    disabled?: boolean
    inProgress?: boolean
    inProgressText?: string
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    icon?: string
    onClick: () => void
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = (
    {
        value,
        actionLabel,
        disabled,
        inProgress,
        inProgressText,
        icon,
        onClick,
        style
    }): React.ReactElement => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onClick !== "undefined" && onClick !== null && !inProgress && !disabled) {
            onClick();
        }
    };

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={handleOnClick}
            activeOpacity={0.8}>
            <View
                style={[ButtonsStyles.highlightContainer, style, {
                    flexDirection: "row",
                    backgroundColor: disabled ? COLORS.darkGrey : COLORS.yellow,
                }]}>
                {inProgress ?
                    <ActivityIndicator
                        style={{
                            marginTop: 20,
                        }}
                        size="small"
                        color={"white"}
                    /> :
                    <FeatherIcon name={icon} color="white" size={15} style={{marginRight: 10}}/>
                }
                <TextAtom style={ButtonsStyles.whiteText}>{inProgress ? inProgressText : value}</TextAtom>
            </View>
        </TouchableOpacity>
    );
};

interface CancelButtonProps extends ViewProps {
    value: string
    actionLabel: string
    inProgress?: boolean
    onClick: () => void
}

export const CancelButton: React.FC<CancelButtonProps> = (
    {
        value,
        actionLabel,
        inProgress,
        onClick,
        style
    }): React.ReactElement => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onClick !== "undefined" && onClick !== null && !inProgress) {
            onClick();
        }
    };

    return (
        <TouchableOpacity
            onPress={handleOnClick}
            activeOpacity={0.8}>
            <View style={[ButtonsStyles.cancelButtonContainer, style ?? {}]}>
                <TextAtom style={ButtonsStyles.whiteText}>
                    {
                        inProgress ?
                            <ActivityIndicator
                                style={{
                                    marginTop: 20,
                                }}
                                size="small"
                                color={COLORS.red}
                            />
                            : value
                    }
                </TextAtom>
            </View>
        </TouchableOpacity>
    );
};

interface SubmitButtonProps extends ViewProps {
    value: string
    actionLabel: string
    disabled?: boolean
    inProgress?: boolean
    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    icon?: string
    onClick: () => void
}

export const SubmitButton: React.FC<SubmitButtonProps> = (
    {
        value,
        actionLabel,
        disabled,
        inProgress,
        icon,
        onClick,
        style
    }): React.ReactElement => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onClick !== "undefined" && onClick !== null && !inProgress && !disabled) {
            onClick();
        }
    };

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={handleOnClick}
            activeOpacity={0.8}>
            <View
                style={[ButtonsStyles.squareContainer, ButtonsStyles.primaryButton, style ?? {}, {
                    backgroundColor: disabled ? COLORS.darkGrey : COLORS.lightBlue,
                    flexDirection: "row",
                }]}>
                {icon && !inProgress ?
                    <FeatherIcon name={icon} color="white" size={15} style={{marginRight: 10}}/> : null}
                <TextAtom style={ButtonsStyles.whiteText}>
                    {
                        inProgress ?
                            <ActivityIndicator
                                style={{
                                    marginTop: 20,
                                }}
                                size="small"
                                color={"white"}
                            />
                            : value

                    }
                </TextAtom>
            </View>
        </TouchableOpacity>
    );
};

interface ControlButtonProps extends ViewProps {
    actionLabel: string,
    onClick: () => void
}

export const ControlButton: React.FC<ControlButtonProps> = (
    {
        actionLabel,
        onClick,
        style,
        children
    }): React.ReactElement => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onClick !== "undefined" && onClick !== null) {
            onClick();
        }
    };

    return (
        <TouchableOpacity onPress={handleOnClick} activeOpacity={0.8}>
            <View
                style={
                    typeof style !== "undefined"
                        ? [ButtonsStyles.control, style]
                        : ButtonsStyles.control
                }>
                {children}
            </View>
        </TouchableOpacity>
    );
};

interface LowProfileButtonProps extends ViewProps {
    value: string
    actionLabel: string,
    disabled?: boolean
    onClick: () => void
}

export const LowProfileButton: React.FC<LowProfileButtonProps> = (
    {
        value,
        actionLabel,
        disabled,
        onClick,
        style
    }): React.ReactElement => {
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(onButtonClick(actionLabel));
        if (typeof onClick !== "undefined" && onClick !== null && !disabled) {
            onClick();
        }
    };

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={handleOnClick}
            activeOpacity={0.8}>
            <View
                style={[ButtonsStyles.lowProfileButton, style]}>
                <TextAtom style={
                    typeof style !== "undefined"
                        ? [ButtonsStyles.lowProfileText, style]
                        : ButtonsStyles.lowProfileText
                }>
                    {value}
                </TextAtom>
            </View>
        </TouchableOpacity>
    );
};


