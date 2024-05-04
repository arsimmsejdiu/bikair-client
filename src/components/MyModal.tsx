import React from "react";
import {Modal, StyleSheet, TouchableWithoutFeedback, View, ViewProps} from "react-native";

interface Props extends ViewProps {
    visible?: boolean
    onClose?: () => void
    slide?: boolean
}

const MyModal: React.FC<Props> = (
    {
        visible,
        onClose,
        slide,
        style,
        children
    }): React.ReactElement => {

    const handleClose = () => {
        if (typeof onClose !== "undefined") {
            onClose();
        }
    };

    return (
        <View style={[styles.centeredView, style]}>
            <Modal
                animationType={slide ? "slide" : "fade"}
                transparent={true}
                visible={visible}
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={StyleSheet.absoluteFill}/>
                </TouchableWithoutFeedback>
                {children}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
});

export default MyModal;
