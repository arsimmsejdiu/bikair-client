import {COLORS, FeatherIcon} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import BleSettingsButton from "@components/BleSettingsButton";
import MyModal from "@components/MyModal";
import {bluetoothErrorModalStyles} from "@styles/ClusterStyles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View, ViewProps} from "react-native";

interface Props extends ViewProps {
    visible: boolean,
    onClose?: () => void
}

const BluetoothErrorModal: React.FC<Props> = (
    {
        visible,
        onClose
    }): React.ReactElement => {

    const [show, setShow] = useState(false);

    // Redux
    const {t} = useTranslation();

    const handleClose = () => {
        if (typeof onClose !== "undefined") {
            onClose();
        }
    };

    useEffect(() => {
        if (visible !== show) {
            setShow(visible);
        }
    }, [visible]);

    return (
        <MyModal visible={show} slide={true} onClose={handleClose}>
            <View style={bluetoothErrorModalStyles.container}>
                <View style={[bluetoothErrorModalStyles.modalView, {
                    alignItems: "center",
                }]}>
                    <View style={bluetoothErrorModalStyles.closeButton}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleClose}
                        >
                            <FeatherIcon
                                name={"x"}
                                size={30}
                                color={COLORS.darkGrey}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>

                        <TextAtom style={bluetoothErrorModalStyles.title}>
                            {t("bluetooth_error.title")}{"\n"}
                        </TextAtom>
                        <TextAtom style={bluetoothErrorModalStyles.paragraphe}>
                            {t("bluetooth_error.line_1")}
                        </TextAtom>
                    </View>
                    <View style={bluetoothErrorModalStyles.buttonContainer}>
                        <BleSettingsButton/>
                    </View>
                </View>
            </View>
        </MyModal>
    );
};

export default BluetoothErrorModal;
