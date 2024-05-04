import {COLORS, ImgBle, ImgPriceEn, ImgPriceFr} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import MyModal from "@components/MyModal";
import {bluetoothStyles} from "@styles/ClusterStyles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View, ViewProps} from "react-native";

type Props = ViewProps

const BlueTooth: React.FC<Props> = (): React.ReactElement => {

    const [modal, setModal] = React.useState(true);
    const [locale, setLocale] = useState("fr");
    const {i18n, t} = useTranslation();

    const handleClose = () => {
        setModal(false);
    };

    useEffect(() => {
        const newLocale = i18n.language === "fr" ? "fr" : "en";
        setLocale(newLocale);
    }, [i18n.language]);

    return <View style={bluetoothStyles.container}>
        <MyModal
            slide={true}
            visible={modal}
            onClose={handleClose}
        >
            <View style={[bluetoothStyles.container, {flex: 1}]}>
                <View style={bluetoothStyles.modalView}>
                    <TextAtom style={bluetoothStyles.textOpen}>
                        {t("alert.bluetooth.open")}
                    </TextAtom>
                    <TextAtom style={bluetoothStyles.message}>
                        {t("alert.bluetooth.message")}
                    </TextAtom>
                    <View style={bluetoothStyles.imageContainer}>
                        <ImageAtom style={bluetoothStyles.imageBle} source={ImgBle}/>
                        <TextAtom style={{width: 20}}/>
                        <ImageAtom
                            style={bluetoothStyles.imageLock}
                            source={locale === "fr" ? ImgPriceFr : ImgPriceEn}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={bluetoothStyles.button}>
                        <TextAtom>Ok</TextAtom>
                    </TouchableOpacity>
                </View>
            </View>
        </MyModal>
    </View>;
};

export default BlueTooth;
