import {TextAtom} from "@components/Atom/TextAtom";
import React from "react";
import {StyleSheet, ViewProps} from "react-native";


interface ErrorMessageProps extends ViewProps {
    message?: string | {message: string} | null
}

const ErrorMessage: React.FC<ErrorMessageProps> = (
    {
        message
    }): React.ReactElement | null => {

    const getMessage = () => {
        if (typeof message === "string") {
            return message;
        } else {
            return message?.message;
        }
    };

    if (!message) return null;

    return <TextAtom style={styles.text}> {getMessage()}</TextAtom>;
};

export default ErrorMessage;

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        color: "red",
        marginBottom: 10,
        textAlign: "center"
    }
});

