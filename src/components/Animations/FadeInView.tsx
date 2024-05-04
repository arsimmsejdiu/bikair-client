import type {PropsWithChildren} from "react";
import React, {useEffect,useRef} from "react";
import type {ViewStyle} from "react-native";
import {Animated, View} from "react-native";

type FadeInViewProps = PropsWithChildren<{style?: ViewStyle}>;

export const FadeInView: React.FC<FadeInViewProps> = (props) => {
    const fadeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true
        }).start();
    }, [fadeAnimation]);

    return (
        <Animated.View style={{
            ...props.style,
            opacity: fadeAnimation
        }}>
            {props.children}
        </Animated.View>
    );
};

export const FadeInViewSteps: React.FC<FadeInViewProps> = (props) => {
    const fadeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 1150,
            useNativeDriver: true
        }).start();
    }, [fadeAnimation]);

    return (
        <Animated.View style={{
            ...props.style,
            opacity: fadeAnimation
        }}>
            {props.children}
        </Animated.View>
    );
};

export const TextReveal: React.FC<FadeInViewProps> = (props) => {
    const slideAnimation = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, [slideAnimation]);

    return (
        <View style={{
            width: "100%",
            paddingVertical: 1,
            overflow: "hidden"
        }}>
            <Animated.View style={{
                transform: [{translateX: slideAnimation}]
            }}>
                {props.children}
            </Animated.View>
        </View>
    );
};
